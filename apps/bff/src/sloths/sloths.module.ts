import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SlothsController } from './sloths.controller';

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
  ],
})
export class SlothsModule {}
