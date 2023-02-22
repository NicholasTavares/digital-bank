import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { PaginationUsersDTO } from './dto/pagination-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll({ text }: PaginationUsersDTO): Promise<User[]> {
    const users = await this.userRepository.findAll(text);

    return users;
  }

  async findMe(user_id: string) {
    const user = await this.userRepository.findMe(user_id);

    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findUser(id);

    return user;
  }

  async findUserByEmailForAuth(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['password', 'id', 'email', 'username'],
    });

    return user;
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const user = await this.userRepository.createUser(createUserDTO);

    return user;
  }

  async update(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.updateUser(id, updateUserDTO);

    return user;
  }

  async remove(id: string) {
    await this.userRepository.softRemoveUser(id);
  }
}
