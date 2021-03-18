import { Test, TestingModule } from '@nestjs/testing';
import { FocusedMarketController } from './focused-market.controller';

describe('FocusedMarket Controller', () => {
  let controller: FocusedMarketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FocusedMarketController],
    }).compile();

    controller = module.get<FocusedMarketController>(FocusedMarketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
