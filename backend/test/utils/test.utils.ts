import { DataSource } from 'typeorm';
import { adminStub, registerAdminStub, registerUserStub, userStub } from '../mockdata/stubs/user-stub';
import { User } from '../../src/users/entity/user.entity';

/**
 * Function to seed test database.
 * @param dataSource connection of current database.
 */
export const seedDatabase = async (dataSource: DataSource) => {
  await dataSource.transaction(async (manager) => {
    await manager.getRepository(User).save(manager.getRepository(User).create(registerAdminStub()));
    await manager.getRepository(User).save(manager.getRepository(User).create(registerUserStub()));
  });
};

/**
 * Function to clear test database.
 * @param dataSource connection of current database.
 */
export const clearDatabase = async (dataSource: DataSource) => {
  await dataSource.transaction(async (manager) => {
    await manager.getRepository(User).delete(adminStub().id);
    await manager.getRepository(User).delete(userStub().id);
  });
};
