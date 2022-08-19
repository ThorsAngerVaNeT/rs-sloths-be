import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SlothsController } from './sloths.controller';

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
})
export class SlothsModule {}
