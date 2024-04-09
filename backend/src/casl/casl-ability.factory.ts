import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Dish } from '../dishes/entity/dish.entity';
import { User } from '../users/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { Action } from './permissions/action';
import { Role } from '../users/user-roles';

type Subjects = InferSubjects<typeof Dish | typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

/**
 * Defines what permission a certain user has depending on their assigned role.
 * Admins have CRUD access to every entity available.
 */
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const {
      can: allow,
      cannot: forbid,
      build,
    } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    if (user.role == Role.Admin) {
      // read-write access to everything
      allow(Action.Manage, 'all');
    }

    // Users
    allow(Action.Create, User);
    allow(Action.Read, User, { id: user.id });
    allow(Action.Update, User, { id: user.id });
    allow(Action.Delete, User, { id: user.id });

    // Dishes
    allow(Action.Create, Dish);
    allow(Action.Read, Dish);
    allow(Action.Update, Dish, { userId: user.id });
    allow(Action.Delete, Dish, { userId: user.id });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
