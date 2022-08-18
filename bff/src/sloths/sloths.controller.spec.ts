import { Test, TestingModule } from '@nestjs/testing';
import { SlothsController } from './sloths.controller';

describe('SlothsController', () => {
  let controller: SlothsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlothsController],
      providers: [],
    }).compile();

    controller = module.get<SlothsController>(SlothsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
