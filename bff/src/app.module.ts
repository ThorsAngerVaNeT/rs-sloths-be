import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SlothsModule } from './sloths/sloths.module';

@Module({
  imports: [UsersModule, SlothsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
