import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from './dish.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class DishType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 42,
  })
  name: string;

  @ApiHideProperty()
  @ManyToMany(() => Dish, { onDelete: 'CASCADE' })
  dishes: Dish[];
}
