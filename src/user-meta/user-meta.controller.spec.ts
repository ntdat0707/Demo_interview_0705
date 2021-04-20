import { Test, TestingModule } from '@nestjs/testing';
import { UserMetaController } from './user-meta.controller';

describe('UserMeta Controller', () => {
  let controller: UserMetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMetaController],
    }).compile();

    controller = module.get<UserMetaController>(UserMetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
