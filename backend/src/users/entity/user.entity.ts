import { BaseEntity, Check, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from '../../dishes/entity/dish.entity';
import { UserDecisionTree } from '../../decisions/entity/user-decision-tree.entity';
import { Role } from '../user-roles';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profileImagePath: string;

  @Column({
    type: 'varchar',
    length: 42,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 42,
  })
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Dish, (dish) => dish.id)
  dishes: Dish[];

  @OneToMany(() => UserDecisionTree, (userDecisionTree) => userDecisionTree.id)
  userDecisionTrees: UserDecisionTree[];

  @Column({
    type: 'varchar',
    length: 20,
    enum: Role,
    default: Role.User,
  })
  @Check(`"role" ='user' OR "role" ='admin'`)
  role: Role;
}
