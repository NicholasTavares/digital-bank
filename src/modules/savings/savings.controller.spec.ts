import { Test, TestingModule } from '@nestjs/testing';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';

describe('SavingsController', () => {
  let controller: SavingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavingsController],
      providers: [SavingsService],
    }).compile();

    controller = module.get<SavingsController>(SavingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
