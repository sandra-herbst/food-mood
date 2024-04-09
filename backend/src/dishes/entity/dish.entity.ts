import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Label } from './label.entity';
import { DishType } from './dish-type.entity';

@Entity()
export class Dish extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 42,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdateAt: Date;

  @Column({
    type: 'int',
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @ManyToMany(() => Label, { onDelete: 'CASCADE', eager: true })
  @JoinTable({ name: 'dish_labels' })
  labels: Label[];

  @ManyToMany(() => DishType, { onDelete: 'CASCADE', eager: true })
  @JoinTable({ name: 'dish_dishTypes' })
  dishTypes: DishType[];
}
