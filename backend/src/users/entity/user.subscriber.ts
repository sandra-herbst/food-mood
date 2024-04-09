import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { User } from './user.entity';
import { bcryptHelper } from '../../utils';

/**
 * Subscribes to User Entity related events.
 * Hashes password accordingly.
 */
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.password = bcryptHelper.hashPassword(event.entity.password);
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity.password !== event.databaseEntity.password) {
      event.entity.password = bcryptHelper.hashPassword(event.entity.password);
    }
  }
}
