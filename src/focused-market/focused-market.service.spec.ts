import { Test, TestingModule } from '@nestjs/testing';
import { FocusedMarketService } from './focused-market.service';

describe('FocusedMarketService', () => {
  let service: FocusedMarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FocusedMarketService],
    }).compile();

    service = module.get<FocusedMarketService>(FocusedMarketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
