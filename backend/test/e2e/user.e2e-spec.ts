import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  adminStub,
  registerAdminStub,
  registerTestUserStub,
  registerUserStub,
  updateUserStub,
  userStub,
} from '../mockdata/stubs/user-stub';
import { RegisterUserDto, TokenRO } from '../../src/auth/dto';
import { User } from '../../src/users/entity/user.entity';
import { TypeOrmConfigModule } from '../../src/config/typeorm';
import { DataSource } from 'typeorm';
import { clearDatabase, seedDatabase } from '../utils/test.utils';
import { UpdateUserDto } from '../../src/users/dto';
import { Logger } from '../../src/logger/logger.service';
import { GlobalHttpExceptionFilter, TypeORMExceptionFilter } from '../../src/common/filters';
import { Reflector } from '@nestjs/core';

/**
 * E2E for UserController.
 */
describe('UserController E2E Test', () => {
  let app: INestApplication;
  let server: any;
  let dataSource: DataSource;

  const adminStubObject: User = adminStub();
  const userStubObject: User = userStub();

  const registerTestUserStubObject: RegisterUserDto = registerTestUserStub();
  const updateUserObject: UpdateUserDto = updateUserStub();

  const authUrl = '/api/auth';
  const userUrl = '/api/users';
  const createUrl = `${authUrl}/register`;
  const loginUrl = `${authUrl}/login`;

  const imageFilePath = `${__dirname}/../mockdata/testfiles/test.png`;

  const nonExistentUserId = 42;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmConfigModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // use our custom logger
    const logger: Logger = new Logger();

    app.useLogger(logger);
    app.useGlobalFilters(new GlobalHttpExceptionFilter(logger));
    app.useGlobalFilters(new TypeORMExceptionFilter(logger));
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // set up validation pipe for validating specific errors
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // get http server
    server = app.getHttpServer();

    // get current database connection
    dataSource = app.get(DataSource);

    // seed database
    await seedDatabase(dataSource);

    await app.init();
  });

  afterEach(async () => {
    await clearDatabase(dataSource);

    server.close();
    await app.close();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  /**
   * POST Endpoint - Register User
   */
  describe('AUTHENTICATION POST api/auth/register | post user', () => {
    it('should create a new user and return 201', () => {
      return request(server).post(createUrl).send(registerTestUserStubObject).expect(HttpStatus.CREATED);
    });

    it('should not create a user when email is a duplicate and return 422', () => {
      return request(server).post(createUrl).send(registerUserStub()).expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should not create a user when invalid email is provided and return 400', () => {
      return request(server)
        .post(createUrl)
        .send({
          username: registerTestUserStubObject.username,
          email: 'invalidmail',
          password: registerTestUserStubObject.password,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create a user when more attributes are given than allowed', () => {
      return request(server).post(createUrl).send(registerAdminStub()).expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create a user when too long username is provided and return 400', () => {
      return request(server)
        .post(createUrl)
        .send({
          username: 'ThisIsAVeryLongNameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          email: registerTestUserStubObject.email,
          password: registerTestUserStubObject.password,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create a user when too long email is provided and return 400', () => {
      return request(server)
        .post(createUrl)
        .send({
          username: registerTestUserStubObject.username,
          email: 'VeryLongEmaillllllllllllllllllllllllllllllllllllllllllllllllllllllllllll@email.de',
          password: registerTestUserStubObject.password,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create a user when invalid password is provided and return 400', () => {
      return request(server)
        .post(createUrl)
        .send({
          username: registerTestUserStubObject.username,
          email: 'anothertest@mail.de',
          password: 'invalidpassword',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  /**
   * POST Endpoint - Authenticate User with user permissions
   */
  describe('AUTHENTICATION POST api/auth/login | post user with user permissions', () => {
    let token: TokenRO;
    let accessToken = '';

    it('should login user', async () => {
      const response = await request(server)
        .post(loginUrl)
        .send({
          email: userStubObject.email,
          password: userStubObject.password,
        })
        .expect(HttpStatus.CREATED);

      token = response.body;
      accessToken = token.tokenData.access_token;

      // jwt regex
      expect(accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    });

    it('should fail to authenticate user with an incorrect credentials', async () => {
      const response = await request(server)
        .post(loginUrl)
        .send({
          email: userStubObject.email,
          password: 'wrongpassword',
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.tokenData).not.toBeDefined();
    });

    /**
     * GET Endpoint - Get routes with authenticated user and user permissions
     */
    describe('PROTECTED GET api/users | get user with user permissions', () => {
      it('/GET with authentication but no permission should not return all users', () => {
        return request(server).get(userUrl).set('Authorization', `Bearer ${accessToken}`).expect(HttpStatus.FORBIDDEN);
      });

      it('/GET :id user with authentication and with permission should return 200', () => {
        return request(server)
          .get(`${userUrl}/${userStubObject.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.OK);
      });

      it('/GET :id user with authentication and without permission for other users should fail and return 403', () => {
        return request(server)
          .get(`${userUrl}/${adminStubObject.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    /**
     * PATCH Endpoint - Patch routes with authenticated user and user permissions
     */
    describe('PROTECTED PATCH api/users/:id | update user with user permissions', () => {
      it('/PATCH :id user with authentication and with permission and valid credentials should update user', () => {
        return request(server)
          .patch(`${userUrl}/${userStubObject.id}`)
          .send(updateUserObject)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.OK);
      });

      it('/PATCH :id user with authentication without and permission for other users should fail and return 400', () => {
        return request(server)
          .patch(`${userUrl}/${adminStubObject.id}`)
          .send({ username: 'hello-world' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('/PATCH :id user with authentication and with permission but with invalid email should fail and return 400', () => {
        return request(server)
          .patch(`${userUrl}/${adminStubObject.id}`)
          .send({
            username: 'hello-world',
            email: 'invalidmail',
            password: 'Validpassword?.1',
          })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('/PATCH :id user with authentication and with permission but with invalid password should fail and return 400', () => {
        return request(server)
          .patch(`${userUrl}/${adminStubObject.id}`)
          .send({
            username: 'hello-world',
            email: 'valid@email.de',
            password: 'invalidpassword',
          })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('/PATCH :id user with authentication and with non existing user id should return 404', () => {
        return request(server)
          .patch(`${userUrl}/${nonExistentUserId}`)
          .send(registerTestUserStubObject)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    /**
     * POST Endpoint - Post image with authenticated user and user permissions
     */
    describe('PROTECTED post api/users/:id/image | update user image with user permissions', () => {
      it('/POST :id user with authentication and with permission should update image and return 201', () => {
        return request(server)
          .post(`${userUrl}/${userStubObject.id}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('file', imageFilePath)
          .expect(HttpStatus.CREATED);
      });

      it('/POST :id user with authentication and without permission should not update image and return 403', () => {
        return request(server)
          .post(`${userUrl}/${adminStubObject.id}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('file', imageFilePath)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('/POST :id user with authentication, without permission and invalid form data should not update image and return 400', () => {
        return request(server)
          .post(`${userUrl}/${userStubObject.id}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('/POST :id user with authentication and without permission and no existing user id should not update image and return 404', () => {
        return request(server)
          .post(`${userUrl}/${nonExistentUserId}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('file', imageFilePath)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    /**
     * DELETE Endpoint - Delete image with authenticated user and user permissions
     */
    describe('PROTECTED DELETE api/users/:id/image | delete user image with user permissions', () => {
      it('/DELETE :id user with authentication and with permission should delete image and return 200', () => {
        return request(server)
          .delete(`${userUrl}/${userStubObject.id}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.OK);
      });

      it('/DELETE :id user with authentication and without permission should not delete image and return 403', () => {
        return request(server)
          .delete(`${userUrl}/${adminStubObject.id}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('/DELETE :id user with authentication and without permission and no existing user id should not update image and return 404', () => {
        return request(server)
          .delete(`${userUrl}/${nonExistentUserId}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    /**
     * DELETE Endpoint - Delete routes with authenticated user and user permissions
     */
    describe('PROTECTED DELETE api/users/:id | delete user with user permissions', () => {
      it('/DELETE user with authentication and without permission should not delete other users and return 403', () => {
        return request(server)
          .delete(`${userUrl}/${adminStubObject.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.FORBIDDEN);
      });

      it('/DELETE user with authentication and with permission but with non existing user should return 404', () => {
        return request(server)
          .delete(`${userUrl}/${nonExistentUserId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('/DELETE user with authentication and with permission should delete user and return 200', () => {
        return request(server)
          .delete(`${userUrl}/${userStubObject.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.OK);
      });
    });
  });

  /**
   * POST Endpoint - Authenticate User with admin permissions
   */
  describe('AUTHENTICATION POST api/auth/login | post user with admin permissions', () => {
    let token: TokenRO;
    let accessToken = '';

    it('should login admin and return 201', async () => {
      const response = await request(server)
        .post(loginUrl)
        .send({
          email: adminStubObject.email,
          password: adminStubObject.password,
        })
        .expect(HttpStatus.CREATED);

      token = response.body;
      accessToken = token.tokenData.access_token;

      // jwt regex
      expect(accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    });

    /**
     * GET Endpoint - Get routes with authenticated user and admin permissions
     */
    describe('PROTECTED GET api/users | post user image with admin permissions', () => {
      it('/GET user with authentication and with permission should return all users and 200', () => {
        return request(server).get(userUrl).set('Authorization', `Bearer ${accessToken}`).expect(HttpStatus.OK);
      });

      it('/GET :id user with authentication and with permission for other users should return user and 200', () => {
        return request(server)
          .get(`${userUrl}/${userStubObject.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.OK);
      });
    });

    /**
     * PATCH Endpoint - Patch routes with authenticated user and admin permissions
     */
    describe('PROTECTED PATCH api/users/:id | update user with admin permissions', () => {
      it('/PATCH :id user with authentication and with permission should return 200', () => {
        return request(server)
          .patch(`${userUrl}/${userStubObject.id}`)
          .send(updateUserObject)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.OK);
      });

      it('/PATCH :id user with authentication and with permission but non existing user should return 404', () => {
        return request(server)
          .patch(`${userUrl}/${nonExistentUserId}`)
          .send(updateUserObject)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    /**
     * POST Endpoint - Post image with authenticated user and admin permissions
     */
    describe('PROTECTED POST api/users/:id | post user image with admin permissions', () => {
      it('/POST :id user with authentication and with permission should update image and return 201', () => {
        return request(server)
          .post(`${userUrl}/${userStubObject.id}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('file', imageFilePath)
          .expect(HttpStatus.CREATED);
      });
    });

    /**
     * DELETE Endpoint - Delete image with authenticated user and admin permissions
     */
    describe('PROTECTED DELETE api/users/:id/image | delete user image', () => {
      it('/DELETE :id user with authentication and with permission should delete image and return 200', () => {
        return request(server)
          .delete(`${userUrl}/${userStubObject.id}/image`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(HttpStatus.OK);
      });
    });
  });

  /**
   * Tests with no authentication
   */
  describe('Unauthenticated', () => {
    /**
     * GET Endpoint - Get routes without authenticated user
     */
    describe('PROTECTED GET /api/users | get user without permission', () => {
      it('/GET without authentication should fail', () => {
        return request(server).get(userUrl).expect(HttpStatus.UNAUTHORIZED);
      });

      it('/GET :id user without authentication should fail', () => {
        return request(server).get(`${userUrl}/1`).expect(HttpStatus.UNAUTHORIZED);
      });
    });

    /**
     * PATCH Endpoint - Patch routes without authenticated user
     */
    describe('PROTECTED PATCH api/users/:id | update user without permission', () => {
      it('/PATCH :id user without authentication should fail and return 401', () => {
        return request(server)
          .patch(`${userUrl}/${userStubObject.id}`)
          .send(registerTestUserStubObject)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    /**
     * DELETE Endpoint - Delete routes without authenticated user
     */
    describe('PROTECTED DELETE api/users/:id | delete user without permission', () => {
      it('/DELETE :id user without authentication should fail and return 401', () => {
        return request(server)
          .delete(`${userUrl}/${userStubObject.id}`)
          .send(registerTestUserStubObject)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    /**
     * PATCH Endpoint - Patch routes without authenticated user
     */
    describe('PROTECTED PATCH api/users/:id/image | update user image without permission', () => {
      it('/PATCH :id user image without authentication should fail and return 401', () => {
        return request(server)
          .patch(`${userUrl}/${userStubObject.id}`)
          .send(registerTestUserStubObject)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    /**
     * DELETE Endpoint - Delete routes without authenticated user
     */
    describe('PROTECTED DELETE api/users/:id/image | delete user image without permission', () => {
      it('/DELETE :id user image without authentication should fail and return 401', () => {
        return request(server)
          .delete(`${userUrl}/${userStubObject.id}`)
          .send(registerTestUserStubObject)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
