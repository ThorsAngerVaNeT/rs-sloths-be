import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { SlothsModule } from '../sloths/sloths.module';

@Module({
  imports: [SlothsModule],
  controllers: [DownloadController],
  providers: [DownloadService],
})
export class DownloadModule {}
