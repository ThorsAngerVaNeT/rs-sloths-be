import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SlothsModule } from './sloths/sloths.module';
import { AuthModule } from './auth/auth.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { RolesGuard } from './rbac/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { DownloadModule } from './download/download.module';
import { GamesModule } from './games/games.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { winstonOptions } from './configs/winston.config';

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
    GamesModule,
    WinstonModule.forRoot(winstonOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    Logger,
  ],
})
export class AppModule {}
