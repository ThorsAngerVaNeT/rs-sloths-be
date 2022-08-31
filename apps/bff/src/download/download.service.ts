import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as archiver from 'archiver';
import { createReadStream } from 'fs';
import { extname, join } from 'path';
import { SlothsService } from '../sloths/sloths.service';
import { ParamSlothIdsDto } from './dto/param-sloth-ids.dto';

@Injectable()
export class DownloadService {
  constructor(private slothsService: SlothsService, private readonly configService: ConfigService) {}

  async findAll(query: ParamSlothIdsDto) {
    const where = {
      id: { in: query.slothIds },
    };
    const sloth = await this.slothsService.findAll({ filter: JSON.stringify(where) });
    if (sloth && sloth.count) {
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      sloth.items.forEach(async (item) => {
        const filePath = join(`${this.configService.get('PUBLIC_FOLDER_PATH')}`, item.image_url);
        const newFileName = `${item.caption.toLowerCase().replace(' ', '-')}${extname(item.image_url)}`;

        archive.append(createReadStream(filePath), { name: newFileName });
      });
      archive.finalize();
      return archive;
    }

    throw new NotFoundException('Files are not found!');
  }
}
