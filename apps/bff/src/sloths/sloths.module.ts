import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SlothsController } from './sloths.controller';
import { SlothsService } from './sloths.service';

@Module({
  imports: [],
  controllers: [SlothsController],
  providers: [
    {
      provide: 'SLOTHS',
      useFactory: (configService: ConfigService) => {
        const port = configService.get('SLOTHS_SERVICE_PORT');
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port,
          },
        });
      },
      inject: [ConfigService],
    },
    SlothsService,
  ],
  exports: [SlothsService],
})
export class SlothsModule {}
