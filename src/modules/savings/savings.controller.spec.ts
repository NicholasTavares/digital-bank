import { Test, TestingModule } from '@nestjs/testing';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { SavingRepository } from './repositories/saving.repository';
import { AccountsService } from '../accounts/accounts.service';
import { SavingSummary } from './interfaces';

describe('SavingsController', () => {
  let controller: SavingsController;
  let service: SavingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [SavingsController],
      providers: [
        {
          provide: SavingsService,
          useValue: {
            findOne: jest.fn(),
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
    service = module.get<SavingsService>(SavingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMe', () => {
    it('should call the service with the correct account_id', async () => {
      const req = {
        user: { account_id: '36c4c1e8-d8aa-4ce5-91b1-1ba0d72a310d' },
      } as unknown as Request;

      const result: SavingSummary = {
        id: '36c4c1e8-d8aa-4ce5-91b1-1ba0d72a310d',
        balance: 1000,
        yield: 50,
      };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(result));

      const response = await controller.findMe(req);

      expect(service.findOne).toHaveBeenCalledWith(
        '36c4c1e8-d8aa-4ce5-91b1-1ba0d72a310d',
      );
      expect(response).toEqual(result);
    });
  });
});
