import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserDecision } from './user-decision.entity';
import { BaseEntity } from 'typeorm/repository/BaseEntity';

@Entity()
export class UserDecisionTree extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
  })
  size: number;

  @OneToMany(() => UserDecision, (userDecision) => userDecision.tree, {
    eager: true,
  })
  userDecisions: UserDecision[];
}
