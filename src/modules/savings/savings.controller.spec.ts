import { Test, TestingModule } from '@nestjs/testing';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { Saving } from './entities/saving.entity';
import { UsersModule } from '../users/users.module';
import { SavingRepository } from './repositories/saving.repository';
import { AccountsModule } from '../accounts/accounts.module';
import { AccountsService } from '../accounts/accounts.service';

describe('SavingsController', () => {
  let controller: SavingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [SavingsController],
      providers: [
        {
          provide: SavingsService,
          useValue: {
            findSaving: jest.fn(),
            depositValue: jest.fn(),
            withdrawValue: jest.fn(),
          },
        },
        {
          provide: SavingRepository,
          useValue: {
            findOne: jest.fn(),
            findSaving: jest.fn(),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SavingsController>(SavingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
