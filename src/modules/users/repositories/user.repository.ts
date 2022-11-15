import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';

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
    });

    return user;
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const user = this.create(createUserDTO);

    await this.save(user);

    return user;
  }
}
