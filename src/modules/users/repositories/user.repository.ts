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
const INITIAL_SAVING_BALANCE_TOTAL_IN_CENTS = 1000; // 10 reais

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
        'user.verified_at as verified_at',
        'user.email as email',
        'user.created_at as created_at',
      ])
      .addSelect(['account.id', 'account.balance'])
      .getRawOne();

    return user;
  }

  async findUser(user_id: string): Promise<User> {
    const user = await this.findOne({
      where: {
        id: user_id,
      },
      select: ['id', 'username', 'email', 'verified_at'],
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findUserByEmailForResetPassword(email: string): Promise<User> {
    const user = await this.findOne({
      where: {
        email,
      },
      select: ['id'],
    });

    return user;
  }

  async findUserByEmailForAuth(email: string): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .innerJoin('user.account', 'account')
      .where('user.email = :email', { email })
      .select([
        'user.id as id',
        'user.username as username',
        'user.email as email',
        'user.password as password',
      ])
      .addSelect(['account.id'])
      .getRawOne();

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
        saving: {
          balance: INITIAL_SAVING_BALANCE_TOTAL_IN_CENTS,
          total: INITIAL_SAVING_BALANCE_TOTAL_IN_CENTS,
        },
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

  async softRemoveUser(user_id: string) {
    const user = await this.findOne({
      where: {
        id: user_id,
      },
      relations: ['account'],
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await this.softRemove(user);
  }
}
