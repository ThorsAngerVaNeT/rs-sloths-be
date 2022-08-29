import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SlothsController } from './sloths.controller';
import { SlothsService } from './sloths.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SLOTHS',
        transport: Transport.TCP,
        options: {
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [SlothsController],
  providers: [],
  exports: [SlothsService],
})
export class SlothsModule {}
