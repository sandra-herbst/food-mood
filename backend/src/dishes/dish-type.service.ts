import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DishType } from './entity/dish-type.entity';

@Injectable()
export class DishTypeService {
  constructor(
    @InjectRepository(DishType)
    private dishTypeRepository: Repository<DishType>,
  ) {}

  /**
   * Find all dish types.
   */
  async findAll(): Promise<DishType[]> {
    return this.dishTypeRepository.find();
  }

  /**
   * Find a dish type by its id.
   * @param dishTypeId of the dishType that should be searched for.
   */
  async findById(dishTypeId: number): Promise<DishType> {
    return await this.dishTypeRepository.findOneOrFail({
      where: {
        id: dishTypeId,
      },
    });
  }
}
