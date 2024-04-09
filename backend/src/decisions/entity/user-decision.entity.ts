import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from '../../dishes/entity/dish.entity';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { UserDecisionTree } from './user-decision-tree.entity';

export enum Decision {
  DECISION_ONE = 'option_one',
  DECISION_TWO = 'option_two',
}

@Entity()
export class UserDecision extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
  })
  position: number;

  @ManyToOne(() => Dish, {
    onDelete: 'CASCADE',
    eager: true,
  })
  optionOne: Dish;

  @ManyToOne(() => Dish, {
    onDelete: 'CASCADE',
    eager: true,
  })
  optionTwo: Dish;

  @Column({
    type: 'int',
    nullable: true,
  })
  treeId: number;

  @ManyToOne(() => UserDecisionTree, (userDecisionTree) => userDecisionTree.userDecisions, {
    onDelete: 'CASCADE',
  })
  tree: UserDecisionTree;

  @Check(`"decision" = 'option_one' OR "decision" = 'option_two'`)
  @Column({
    type: 'varchar',
    enum: Decision,
  })
  decision: Decision;
}
