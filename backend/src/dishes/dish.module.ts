import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entity/dish.entity';
import { DishType } from './entity/dish-type.entity';
import { Label } from './entity/label.entity';
import { DishTypeService } from './dish-type.service';
import { LabelService } from './label.service';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, DishType, Label]), CaslModule],
  controllers: [DishController],
  providers: [DishService, DishTypeService, LabelService],
})
export class DishModule {}
