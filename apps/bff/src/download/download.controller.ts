import { Controller, Get, Param, Query } from '@nestjs/common';
import { DownloadService } from './download.service';
import { ParamSlothIdsDto } from './dto/param-sloth-ids.dto';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get(':slothIds')
  findAll(@Param() param: ParamSlothIdsDto) {
    return this.downloadService.findAll(param);
  }
}
