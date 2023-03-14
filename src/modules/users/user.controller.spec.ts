import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PaginationUsersDTO } from './dto/pagination-users.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { VerificationMailToken } from '../verification_mail_tokens/entities/verification_mail_token.entity';
import { ResetPasswordToken } from '../reset_password_token/entities/reset_password_token.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const paginationDTO: PaginationUsersDTO = {
        text: '',
        order: 'DESC',
      };

      const users = [
        {
          id: 'ff3b9b50-a0fe-44e0-a900-e3359a660615',
          username: 'Voldemort',
          email: 'voldemort@hogwarts.com',
          avatar_url: null,
          avatar_key: null,
          birth_date: '1932-06-21T03:00:00.000Z' as unknown as Date,
          verified_at: null,
          reseted_password_at: null,
          created_at: '2023-03-03T05:07:08.057Z' as unknown as Date,
          updated_at: '2023-03-03T05:07:08.057Z' as unknown as Date,
          deleted_at: null,
        },
        {
          id: 'ba129532-320c-499e-ba99-336967352b13',
          username: 'Harry Potter',
          email: 'potter@hogwarts.com',
          avatar_url: null,
          avatar_key: null,
          birth_date: '1932-06-21T03:00:00.000Z' as unknown as Date,
          verified_at: null,
          reseted_password_at: null,
          created_at: '2023-03-03T05:07:24.435Z' as unknown as Date,
          updated_at: '2023-03-03T05:07:24.435Z' as unknown as Date,
          deleted_at: null,
        },
      ];

      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(users as unknown as Promise<User[]>);
      expect(await controller.findAll(paginationDTO)).toBe(users);
    });
  });

  describe('findMe', () => {
    it('should return the current user', async () => {
      const user = {
        user_id: '075aad88-ee2c-4bb5-a1aa-ae7819978052',
        account_id: '72d9b13e-f332-4495-846a-4fca8c4cf0d1',
        account_balance: 10000,
        username: 'Severo Snape',
        birth_date: '1932-06-21T03:00:00.000Z',
        verified_at: '2023-03-08T20:06:36.606Z',
        email: 'snape@hogwarts.com',
        created_at: '2023-03-08T23:02:32.840Z',
      };
      jest.spyOn(service, 'findMe').mockResolvedValue(user as unknown as User);
      expect(await controller.findMe({ user: { id: '123' } })).toBe(user);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: 'ff3b9b50-a0fe-44e0-a900-e3359a660615',
        username: 'Voldemort',
        email: 'voldemort@hogwarts.com',
        verified_at: null,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(user as unknown as User);
      expect(await controller.findOne('123')).toBe(user);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'Severo Snape',
        email: 'snape@hogwarts.com',
        birth_date: new Date('1932-06-21'),
        password: 'U$er321',
        passwordConfirm: 'U$er321',
      };

      const user: User = {
        id: 'ff3b9b50-a0fe-44e0-a900-e3359a660615',
        username: 'Severo Snape',
        email: 'snape@hogwarts.com',
        birth_date: new Date('1932-06-21'),
        verified_at: null,
        avatar_url: '',
        avatar_key: '',
        password: '',
        reseted_password_at: undefined,
        account: new Account(),
        verificationMailToken: new VerificationMailToken(),
        resetPasswordToken: new ResetPasswordToken(),
        created_at: undefined,
        updated_at: undefined,
        deleted_at: undefined,
        hashPassword: function (): void {
          throw new Error('Function not implemented.');
        },
      };

      jest.spyOn(service, 'create').mockImplementation(user);

      const response = await controller.create(createUserDTO);

      const expectedUser = {
        ...user,
        password: undefined,
      };

      expect(response).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should update the current user', async () => {
      const updateUserDTO: UpdateUserDTO = {
        username: 'Salazar Sonserina',
      };
      const user = {
        id: 'cfcdd5e7-4fb6-4558-93ed-067a4410926c',
        username: 'Salazar Sonserina',
        email: 'salazarsonserina@gmail.com',
        verified_at: null,
        birth_date: '1998-04-11T03:00:00.000Z',
        created_at: '2023-02-28T01:29:36.339Z',
        updated_at: '2023-02-28T01:31:30.509Z',
        deleted_at: null,
      };
      jest.spyOn(service, 'update').mockResolvedValue(user as unknown as User);
      expect(
        await controller.update(updateUserDTO, { user: { id: '123' } }),
      ).toBe(user);
    });
  });

  describe('avatar', () => {
    it('should upload an avatar', async () => {
      const req = {
        user: { id: '123' },
      };
      const file = {
        buffer: Buffer.from('test'),
        originalname: 'avatar.png',
        mimetype: 'image/png',
      };
      const user = {};
      jest.spyOn(service, 'avatar').mockResolvedValue(user);
      expect(await controller.avatar(req, file)).toBe(user);
    });
  });

  describe('removeAvatar', () => {
    it('should remove the avatar of the current user', async () => {
      const req = {
        user: { id: '123' },
      };
      const user = {};
      jest.spyOn(service, 'removeAvatar').mockResolvedValue(user);
      expect(await controller.removeAvatar(req)).toBe(user);
    });
  });
});
