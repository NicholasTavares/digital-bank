import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordTokenService } from './reset_password_token.service';

describe('ResetPasswordTokenService', () => {
  let service: ResetPasswordTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetPasswordTokenService],
    }).compile();

    service = module.get<ResetPasswordTokenService>(ResetPasswordTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
