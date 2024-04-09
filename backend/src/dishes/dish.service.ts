import { ForbiddenException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Dish } from './entity/dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from './dto';
import { UpdateDishDto } from './dto';
import { User } from '../users/entity/user.entity';
import { LabelService } from './label.service';
import { DishTypeService } from './dish-type.service';
import { QueryRandomDishesDto } from './dto';
import shuffle from '../utils/shuffle';
import { QueryDishesDto } from './dto';
import { buildImagePath, deleteImage } from '../utils';
import { Action } from '../casl/permissions/action';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private dishesRepository: Repository<Dish>,
    private labelsService: LabelService,
    private dishTypesService: DishTypeService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  /**
   * Find all dishes based on the given query.
   * @param requestingUser that has sent the request.
   * @param queryDishesDto parameters sent by the client.
   */
  async findAll(requestingUser: User, queryDishesDto: QueryDishesDto): Promise<Dish[]> {
    await this.throwUnlessCan(requestingUser, Action.Read);
    const queryBuilder = this.dishesRepository
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.labels', 'labels')
      .leftJoinAndSelect('dish.dishTypes', 'dishTypes')
      .leftJoinAndSelect('dish.user', 'user')
      .orderBy('dish.lastUpdateAt', 'DESC');

    if (queryDishesDto.userId) {
      queryBuilder.where('dish.user.id = :id', { id: queryDishesDto.userId });
    }

    return await queryBuilder.getMany();
  }

  /**
   * Create a dish.
   * @param requestingUser that has sent the request.
   * @param createDishDto parameters sent by the client.
   * @param file image of the dish.
   */
  async createDish(requestingUser: User, createDishDto: CreateDishDto, file: Express.Multer.File): Promise<Dish> {
    await this.throwUnlessCan(requestingUser, Action.Create);
    const dish: Dish = new Dish();
    dish.name = createDishDto.name;
    dish.labels = [];
    dish.dishTypes = [];
    dish.user = requestingUser;

    return await this.updateDish(createDishDto, file, dish);
  }

  /**
   * searches for a predefined number of dishes based on their dishType and the specified labels.
   * @param requestingUser that has sent the request.
   * @param queryRandomDishesDto parameters sent by the client
   */
  async findRandomDishes(requestingUser: User, queryRandomDishesDto: QueryRandomDishesDto) {
    await this.throwUnlessCan(requestingUser, Action.Read);
    // OPTIONAL: This query is in-performant for large data. Change to a shuffle in database
    let query = '';
    let dishTypesJoin = '';

    if (queryRandomDishesDto.dishType) {
      dishTypesJoin = `INNER JOIN "dish_dishTypes" ON "dish_dishTypes"."dishId" = dish.id AND "dish_dishTypes"."dishTypeId" = ${queryRandomDishesDto.dishType}`;
    }

    if (queryRandomDishesDto.labels) {
      // get dishes with given label and dishType
      query = `With DISHES AS (
        SELECT dish.*, COUNT(*) as count
        FROM dish
        INNER JOIN dish_labels ON dish_labels."dishId" = dish.id AND (dish_labels."labelId" IN(${queryRandomDishesDto.labels}) )
        ${dishTypesJoin}
        GROUP BY dish.id
        )
        Select * From DISHES WHERE count = ${queryRandomDishesDto.labels.length};`;
    } else {
      query = `SELECT dish.*
        FROM dish
        ${dishTypesJoin}
        GROUP BY dish.id`;
    }

    const queryResult = await this.dishesRepository.query(query);
    shuffle(queryResult);

    const result = queryResult.slice(0, queryRandomDishesDto.limit);
    return this.dishesRepository.findBy({
      id: In(result.map((d) => d.id)),
    });
  }

  /**
   * Find a dish by their id.
   * @param requestingUser that has sent the request.
   * @param dishId of the user that should be searched for.
   */
  async findDishById(requestingUser: User, dishId: number): Promise<Dish> {
    const dish = await this.findOne(dishId);
    await this.throwUnlessCan(requestingUser, Action.Read, dish);
    return dish;
  }

  /**
   * Find a dish by their id.
   * @param dishId of the dish that should be searched for.
   */
  async findOne(dishId: number): Promise<Dish> {
    return await this.dishesRepository.findOneOrFail({
      where: {
        id: dishId,
      },
    });
  }

  /**
   * Update a dish by their id.
   * @param dishId of the dish that should be updated.
   * @param updateDishDto sent by the client.
   * @param file image of the dish.
   * @param requestingUser that has sent the request.
   */
  async updateDishById(
    dishId: number,
    updateDishDto: UpdateDishDto,
    file: Express.Multer.File,
    requestingUser: User,
  ): Promise<Dish> {
    const dish = await this.findOne(dishId);
    await this.throwUnlessCan(requestingUser, Action.Update, dish);
    return await this.updateDish(updateDishDto, file, dish);
  }

  /**
   * Used to update an object sent by the client.
   * All labels and dishTypes are resolved.
   * The object is then stored in the database.
   * @param updateDishDto The data sent by the client.
   * @param file image of the dish.
   * @param dish that should be updated.
   */
  private async updateDish(updateDishDto: UpdateDishDto, file: Express.Multer.File, dish: Dish): Promise<Dish> {
    // Convert label id's to label Objects and store them in the new dish object
    if (updateDishDto.labels) {
      dish.labels = [];
      if (updateDishDto.labels[0] != -1) {
        dish.labels = await Promise.all(updateDishDto.labels.map(async (e) => this.labelsService.findById(e)));
      }
    }

    if (updateDishDto.dishTypes) {
      dish.dishTypes = [];
      dish.dishTypes = await Promise.all(updateDishDto.dishTypes.map(async (e) => this.dishTypesService.findById(e)));
    }

    if (updateDishDto.name) {
      dish.name = updateDishDto.name;
    }

    if (file) {
      dish.imagePath = buildImagePath(file.path);
    }

    await dish.save();
    return dish;
  }

  /**
   * Remove a dish by its id.
   * @param dishId of the dish that should be deleted.
   * @param requestingUser
   */
  async deleteDishById(dishId: number, requestingUser: User): Promise<number> {
    const dish = await this.findOne(dishId);
    await this.throwUnlessCan(requestingUser, Action.Delete, dish);
    await this.deleteDishImage(dish);
    const deleted = await this.dishesRepository.delete(dishId);
    return deleted.affected;
  }

  /**
   * Delete the image of a dish.
   * Since the dish will be fully deleted whenever the image gets deleted, there is
   * no need to save it.
   * @param dish of which the image should be deleted.
   */
  async deleteDishImage(dish: Dish): Promise<void> {
    await deleteImage(dish.imagePath);
  }

  /**
   * Check if the user that is requesting a dish endpoint can access it.
   * @param requestingUser that is sending the request (Identified by token)
   * @param action of any CRUD operation.
   * @param changingDish dish that is being altered.
   */
  private async throwUnlessCan(requestingUser: User, action: Action, changingDish?: Dish): Promise<void> {
    const ability = this.abilityFactory.createForUser(requestingUser);
    const canAccess = ability.can(action, changingDish ? changingDish : Dish);
    if (!canAccess) {
      throw new ForbiddenException('Forbidden resource. You do not have permission to access the data.');
    }
  }
}
