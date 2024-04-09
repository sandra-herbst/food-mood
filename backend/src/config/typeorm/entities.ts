import { Dish } from '../../dishes/entity/dish.entity';
import { User } from '../../users/entity/user.entity';
import { DishType } from '../../dishes/entity/dish-type.entity';
import { Label } from '../../dishes/entity/label.entity';
import { UserDecisionTree } from '../../decisions/entity/user-decision-tree.entity';
import { UserDecision } from '../../decisions/entity/user-decision.entity';

const entities = [Dish, User, DishType, Label, UserDecisionTree, UserDecision];

export default entities;
