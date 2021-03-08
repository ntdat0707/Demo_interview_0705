import { Test, TestingModule } from '@nestjs/testing';
import { FocusedController } from './focused.controller';

describe('Focused Controller', () => {
  let controller: FocusedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FocusedController],
    }).compile();

    controller = module.get<FocusedController>(FocusedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
