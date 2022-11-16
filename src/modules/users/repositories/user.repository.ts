import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

const INITIAL_BALANCE = 100.0;

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findAll(): Promise<User[]> {
    const users = await this.find();

    return users;
  }

  async findUser(id: any): Promise<User> {
    const user = await this.findOne({
      where: {
        id,
      },
      relations: ['account'],
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const user = this.create({
      ...createUserDTO,
      account: {
        balance: INITIAL_BALANCE,
      },
    });

    await this.save(user);

    return user;
  }

  async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const user = await this.preload({
      id,
      ...updateUserDTO,
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found`);
    }

    await this.save(user);

    return user;
  }

  async softRemoveUser(id: string) {
    const user = await this.findUser(id);
    await this.softRemove(user);
  }
}
