import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SlothsModule } from '../sloths/sloths.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
    ]),
    SlothsModule,
  ],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
