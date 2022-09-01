import { Controller, Get, Header, Param, Query, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { DownloadService } from './download.service';
import { ParamSlothIdsDto } from './dto/param-sloth-ids.dto';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get(':slothIds')
  @Header('Content-Type', 'application/zip')
  async findAll(@Param() param: ParamSlothIdsDto, @Res({ passthrough: true }) res: Response) {
    const stream = await this.downloadService.findAll(param);

    res.header('Content-Disposition', `attachment; filename="sloths_${new Date().toISOString()}.zip"`);
    return new StreamableFile(stream);
  }
}
