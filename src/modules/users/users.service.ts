import { BadRequestException, Injectable } from '@nestjs/common';
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
    const user = await this.userRepository.findUserByEmailForAuth(email);

    return user;
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const birth_date = new Date(createUserDTO.birth_date);
    const today = new Date();
    const over18 = new Date(
      birth_date.getUTCFullYear() + 18,
      birth_date.getUTCMonth(),
      birth_date.getUTCDate(),
    );

    if (over18 >= today) {
      throw new BadRequestException('Usuário menor de 18 anos!');
    }

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
