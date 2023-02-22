import { DataSource, ILike, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

const INITIAL_BALANCE_IN_CENTS = 10000; // 100 reais

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findAll(text: string): Promise<User[]> {
    const users = await this.createQueryBuilder('users')
      .where([
        {
          username: ILike(`%${text}%`),
        },
        {
          email: ILike(`${text}`),
        },
      ])
      .getMany();

    return users;
  }

  async findMe(user_id: string): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .innerJoin('user.account', 'account')
      .where('user.id = :user_id', { user_id })
      .select([
        'user.id',
        'user.username as username',
        'user.birth_date as birth_date',
        'user.email as email',
        'user.created_at as created_at',
      ])
      .addSelect(['account.id', 'account.balance'])
      .getRawOne();

    return user;
  }

  async findUser(id: string): Promise<User> {
    const user = await this.findOne({
      where: {
        id,
      },
      select: ['id', 'username', 'email'],
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
        balance: INITIAL_BALANCE_IN_CENTS,
      },
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate email
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException();
    }

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
