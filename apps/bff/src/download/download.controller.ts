import { Controller, Get, Header, Param, Query, StreamableFile } from '@nestjs/common';
import { DownloadService } from './download.service';
import { ParamSlothIdsDto } from './dto/param-sloth-ids.dto';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get(':slothIds')
  @Header('Content-Type', 'application/zip')
  @Header('Content-Disposition', 'attachment; filename="sloths.zip"')
  async findAll(@Param() param: ParamSlothIdsDto) {
    const stream = await this.downloadService.findAll(param);

    return new StreamableFile(stream);
  }
}
