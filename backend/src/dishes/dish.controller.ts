import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Query,
  UploadedFile,
  Post,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto';
import { UpdateDishDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entity/user.entity';
import { QueryRandomDishesDto } from './dto';
import { DishRO } from './dto';
import { ApiFile, UserData } from '../common/decorators';
import { QueryDishesDto } from './dto';
import { ParseFile } from '../common/pipes';
import { JwtAuthGuard } from '../common/guards';
import {
  DeleteIdResourceResponse,
  GetAllResourceResponse,
  GetIdResourceResponse,
  PatchIdResourceResponse,
  PostResourceResponse,
} from '../common/decorators/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dishes')
@ApiTags('dishes')
export class DishController {
  constructor(private readonly dishesService: DishService) {}

  /**
   * Creates a new dish with the given data.
   * Users can create various dishes.
   */
  @Post()
  @ApiFile('/dishes')
  @PostResourceResponse()
  async create(
    @Body() createDishDto: CreateDishDto,
    @UserData() user: User,
    @UploadedFile(ParseFile) file: Express.Multer.File,
  ): Promise<DishRO> {
    return DishRO.fromEntity(await this.dishesService.createDish(user, createDishDto, file));
  }

  /**
   * Searches for a predefined number of dishes based on their dishType and the specified labels.
   * Users can get random dishes.
   */
  @Get('/random')
  @GetAllResourceResponse()
  async findRandomDishes(
    @UserData() user: User,
    @Query() queryRandomDishesDto: QueryRandomDishesDto,
  ): Promise<DishRO[]> {
    return (await this.dishesService.findRandomDishes(user, queryRandomDishesDto)).map((e) => DishRO.fromEntity(e));
  }

  /**
   * Get all dishes.
   * Users can get all dishes.
   */
  @Get()
  @GetAllResourceResponse()
  async findAll(@UserData() user: User, @Query() queryDishesDto: QueryDishesDto): Promise<DishRO[]> {
    return (await this.dishesService.findAll(user, queryDishesDto)).map((e) => DishRO.fromEntity(e));
  }

  /**
   * Get a dish by its id.
   * Users can get all dishes.
   */
  @Get(':id')
  @GetIdResourceResponse()
  async findOne(@Param('id', ParseIntPipe) id: number, @UserData() user: User): Promise<DishRO> {
    return DishRO.fromEntity(await this.dishesService.findDishById(user, id));
  }

  /**
   * Update a dish.
   * Users can only update their own dish.
   * Admins can update any dish.
   */
  @Patch(':id')
  @PatchIdResourceResponse()
  @ApiFile('/dishes')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDishDto: UpdateDishDto,
    @UserData() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DishRO> {
    return DishRO.fromEntity(await this.dishesService.updateDishById(id, updateDishDto, file, user));
  }

  /**
   * Delete a dish by its id.
   * Users can only delete their own dish.
   * Admins can delete any dish.
   */
  @Delete(':id')
  @DeleteIdResourceResponse()
  async remove(@Param('id', ParseIntPipe) id: number, @UserData() user: User): Promise<void> {
    await this.dishesService.deleteDishById(id, user);
  }
}
