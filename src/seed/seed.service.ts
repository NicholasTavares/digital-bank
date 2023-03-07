import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { UsersService } from '../modules/users/users.service';
import { CreateUserDTO } from '../modules/users/dto/create-user.dto';

@Injectable()
export class SeedService {
  constructor(private readonly usersService: UsersService) {}

  async run() {
    const pass = faker.internet.password() + '$';
    const users: CreateUserDTO[] = [
      {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birth_date: faker.date.birthdate(),
        password: pass,
        passwordConfirm: pass,
      },
    ];

    for (const user of users) {
      await this.usersService.create({
        ...user,
      });
    }
  }
}
