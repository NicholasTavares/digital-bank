import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    return users;
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
