import { Test, TestingModule } from '@nestjs/testing';
import { FocusedService } from './focused.service';

describe('FocusedService', () => {
  let service: FocusedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FocusedService],
    }).compile();

    service = module.get<FocusedService>(FocusedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
