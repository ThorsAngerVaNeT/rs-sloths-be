import { Module } from '@nestjs/common';
import { MICROSERVICES } from '../common/microservices.config';
import { SlothsController } from './sloths.controller';
import { SlothsService } from './sloths.service';

@Module({
  imports: [],
  controllers: [SlothsController],
  providers: [MICROSERVICES.SLOTHS, SlothsService],
  exports: [SlothsService],
})
export class SlothsModule {}
