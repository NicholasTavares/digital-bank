import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    return users;
  }

  async findUser(id: string): Promise<User> {
    const user = await this.userRepository.findUser(id);

    return user;
  }
}
