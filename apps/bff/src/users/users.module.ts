import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SlothsModule } from '../sloths/sloths.module';
import { UsersController } from './users.controller';

@Module({
  imports: [SlothsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'USERS',
      useFactory: (configService: ConfigService) => {
        const port = configService.get('USERS_SERVICE_PORT');
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
export class UsersModule {}
