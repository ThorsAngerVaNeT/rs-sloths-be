import { Injectable } from '@nestjs/common';
import { SlothsService } from '../sloths/sloths.service';
import { ParamSlothIdsDto } from './dto/param-sloth-ids.dto';

@Injectable()
export class DownloadService {
  constructor(private slothsService: SlothsService) {}

  async findAll(query: ParamSlothIdsDto) {
    const where = {
      id: { in: query.slothIds },
    };
    const sloth = await this.slothsService.findAll({ filter: JSON.stringify(where) });
    console.log('sloth: ', sloth);
  }
}
