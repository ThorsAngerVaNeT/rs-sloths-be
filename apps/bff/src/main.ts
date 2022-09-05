import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import { winstonOptions } from './configs/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions),
  });
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: [`${configService.get('FRONT_URL')}`, 'http://localhost:5173', 'https://github.com'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(configService.get('PORT') || 3000, () => {
    console.log(`RS Sloths BFF has been started and running on port: ${configService.get('PORT')}`);
  });
}
bootstrap();
