import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';
import { CreateUserDTO } from './modules/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const seedCount = process.argv[2];

  if (seedCount) {
    const usersService = application.get(UsersService);
    const users: CreateUserDTO[] = [];

    for (let i = 0; i < +seedCount; i++) {
      const pass = faker.internet.password() + '$';
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birth_date: faker.date.birthdate({ min: 18 }),
        password: pass,
        passwordConfirm: pass,
      });
    }

    for (const user of users) {
      await usersService.create({
        ...user,
      });
    }
  }

  await application.close();
  process.exit(0);
}

bootstrap();
