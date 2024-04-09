import { UpdateUserDto } from '../../../src/users/dto';
import { RegisterUserDto } from '../../../src/auth/dto';
import { User } from '../../../src/users/entity/user.entity';
import { Role } from '../../../src/users/user-roles';
import { MockRegisterUserDto } from '../mockdto/mock-register-user.dto';

/**
 * Stub Objects that provide predefined answers to method calls for test purposes.
 */

export const registerAdminStub = (): MockRegisterUserDto => {
  return {
    username: adminStub().username,
    email: adminStub().email,
    password: adminStub().password,
    role: Role.Admin,
  };
};

export const registerUserStub = (): RegisterUserDto => {
  return {
    username: userStub().username,
    email: userStub().email,
    password: userStub().password,
  };
};

export const registerTestUserStub = (): RegisterUserDto => {
  return {
    username: 'ValidUser',
    email: 'valid@email.de',
    password: 'Valid1?',
  };
};

export const adminStub = (): User => {
  const user = new User();
  user.id = 1;
  user.profileImagePath = null;
  user.email = 'admintest@email.de';
  user.password = 'Test1?';
  user.username = 'testadmin';
  user.createdAt = new Date(Date.now());
  user.role = Role.Admin;

  return user;
};

export const userStub = (): User => {
  const user = new User();
  user.id = 2;
  user.profileImagePath = null;
  user.email = 'test@email.de';
  user.password = 'Test1?';
  user.username = 'testuser';
  user.createdAt = new Date(Date.now());
  user.role = Role.User;

  return user;
};

export const updateUserStub = (): UpdateUserDto => {
  return {
    username: 'UpdateUser',
    email: 'updatevalid@email.de',
    password: 'Valid1?',
  };
};

export const expectedUserStub = (): User => {
  const expectedUser = new User();
  expectedUser.id = expect.any(Number);
  expectedUser.profileImagePath = null;
  expectedUser.email = expect.any(String);
  expectedUser.password = expect.any(String);
  expectedUser.username = expect.any(String);
  expectedUser.createdAt = expect.any(Date);
  expectedUser.role = expect.any(String);

  const knownRoles = Object.values(Role);
  expect(knownRoles.includes(expectedUser.role));

  return expectedUser;
};
