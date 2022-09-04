import { Module } from '@nestjs/common';
import { MICROSERVICES } from '../common/microservices.config';
import { SlothsModule } from '../sloths/sloths.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [SlothsModule],
  controllers: [UsersController],
  providers: [MICROSERVICES.USERS, UsersService],
})
export class UsersModule {}
