import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
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

  async findUserByUsernameForAuth(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['password', 'id', 'username'],
    });

    return user;
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const user = await this.userRepository.createUser(createUserDTO);

    return user;
  }

  async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.updateUser(id, updateUserDTO);

    return user;
  }

  async softRemoveUser(id: string) {
    await this.userRepository.softRemoveUser(id);
  }
}
