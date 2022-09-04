import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetAll, GetAllConditions, ServiceResponse } from '../app.interfaces';
import { CreateSlothDto } from './dto/create-sloth.dto';
import { UpdateSlothRatingDto } from './dto/update-sloth-rating.dto';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { Sloth } from './entities/sloth.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class SlothsService {
  constructor(
    @Inject('SLOTHS')
    private readonly client: ClientProxy
  ) {}

  async findAll(conditions: GetAllConditions): Promise<GetAll<Sloth> | undefined> {
    const sloths = await firstValueFrom(
      this.client.send<ServiceResponse<GetAll<Sloth>>>({ cmd: 'get_sloths' }, conditions)
    );

    if (sloths.error) {
      throw new HttpException(sloths.error, sloths.status);
    }

    return sloths.data;
  }

  async findOne(id: string): Promise<Sloth | undefined> {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'get_sloth' }, id));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  async findRandom(): Promise<Sloth | undefined> {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'get_random_sloth' }, {}));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  async create(createSlothDto: CreateSlothDto, imageUrl: string): Promise<Sloth | undefined> {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>({ cmd: 'create_sloth' }, { ...createSlothDto, image_url: imageUrl })
    );

    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  async update(id: string, updateSlothDto: UpdateSlothDto, imageUrl: string): Promise<Sloth | undefined> {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>({ cmd: 'update_sloth' }, { ...updateSlothDto, id, image_url: imageUrl })
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  async remove(id: string) {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'delete_sloth' }, id));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  async findAllTags(): Promise<Tag[] | undefined> {
    const tags = await firstValueFrom(this.client.send<ServiceResponse<Tag[]>>({ cmd: 'get_tags' }, {}));
    if (tags.error) {
      throw new HttpException(tags.error, tags.status);
    }

    return tags.data;
  }

  async updateRating(
    slothId: string,
    updateSlothRatingDto: UpdateSlothRatingDto
  ): Promise<Pick<Sloth, 'id' | 'rating'> | undefined> {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Pick<Sloth, 'id' | 'rating'>>>(
        { cmd: 'update_rating' },
        { ...updateSlothRatingDto, slothId }
      )
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }
}
