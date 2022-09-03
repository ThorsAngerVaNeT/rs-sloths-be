import { Controller, Get, Header, HttpCode, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../rbac/roles.decorator';
import { ROLE } from '../users/entities/user.entity';
import { DownloadService } from './download.service';
import { ParamSlothIdsDto } from './dto/param-sloth-ids.dto';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get(':slothIds')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  @Header('Content-Type', 'application/zip')
  async findAll(@Param() param: ParamSlothIdsDto, @Res({ passthrough: true }) res: Response) {
    const stream = await this.downloadService.findAll(param);

    res.header('Content-Disposition', `attachment; filename="sloths_${new Date().toISOString()}.zip"`);
    return new StreamableFile(stream);
  }
}
