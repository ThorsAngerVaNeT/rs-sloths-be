import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as archiver from 'archiver';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { extname, join } from 'path';
import { getWhere } from '../common/utils';
import { SlothsService } from '../sloths/sloths.service';
import { ParamSlothIdsDto } from './dto/param-sloth-ids.dto';

@Injectable()
export class DownloadService {
  constructor(private slothsService: SlothsService, private readonly configService: ConfigService) {}

  getItemPath(item: string): string {
    return join('./', `${this.configService.get('PUBLIC_FOLDER_PATH')}`, item);
  }

  async findAll(query: ParamSlothIdsDto) {
    const where = getWhere({ filterFields: ['id'], filterValues: query.slothIds });

    const sloth = await this.slothsService.findAll({ ...(where && { where }) });

    if (sloth && sloth.count) {
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      const itemStatsPromises = sloth.items.map((item) => {
        const itemPath = this.getItemPath(item.image_url);
        return stat(itemPath);
      });

      const itemStats = await Promise.allSettled(itemStatsPromises);
      let appendedItemsCount = 0;

      itemStats.forEach((item, i) => {
        if (item.status === 'fulfilled') {
          const itemPath = this.getItemPath(sloth.items[i].image_url);
          const newFileName = `${sloth.items[i].caption.toLowerCase().replace(' ', '-')}${extname(
            sloth.items[i].image_url
          )}`;
          archive.append(createReadStream(itemPath), { name: newFileName });
          appendedItemsCount += 1;
        }
      });

      if (!appendedItemsCount) {
        throw new NotFoundException('Files are not found!');
      }

      archive.finalize();
      return archive;
    }

    throw new NotFoundException('Files are not found!');
  }
}
