import { Module } from '@nestjs/common';
import { createMicroserviceProvider } from '../common/microservices.config';
import { SlothsController } from './sloths.controller';
import { SlothsService } from './sloths.service';

@Module({
  imports: [],
  controllers: [SlothsController],
  providers: [createMicroserviceProvider('SLOTHS'), SlothsService],
  exports: [SlothsService],
})
export class SlothsModule {}
