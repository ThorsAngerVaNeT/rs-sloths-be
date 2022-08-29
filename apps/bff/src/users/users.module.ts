import { Module } from '@nestjs/common';
import { createMicroserviceProvider } from '../common/microservices.config';
import { SlothsModule } from '../sloths/sloths.module';
import { UsersController } from './users.controller';

@Module({
  imports: [SlothsModule],
  controllers: [UsersController],
  providers: [createMicroserviceProvider('USERS')],
})
export class UsersModule {}
