import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SlothsModule } from './sloths/sloths.module';
import { AuthModule } from './auth/auth.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { DownloadModule } from './download/download.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    SlothsModule,
    AuthModule,
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: join(__dirname, '..', `${configService.get('PUBLIC_FOLDER_PATH')}`),
          exclude: ['/auth*', '/users*', '/sloths*', '/suggestions*'],
        },
      ],
    }),
    SuggestionsModule,
    DownloadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
