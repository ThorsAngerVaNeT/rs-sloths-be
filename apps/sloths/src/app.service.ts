import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { Sloth } from './entities/sloth.entity';
import { SlothsRepo } from './app.db.repository';
import { CreateSlothDto } from './dto/create-sloth.dto';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { GetAllConditions, ServiceResponse, SlothsAll } from './app.interfaces';
import { UpdateSlothRatingDto } from './dto/update-sloth-rating.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private slothsRepo: SlothsRepo;

  constructor() {
    this.slothsRepo = new SlothsRepo(new PrismaService());
  }

  async getSloths(params: GetAllConditions): Promise<ServiceResponse<SlothsAll>> {
    return this.slothsRepo.getAll(params);
  }

  async getSloth(where: { id: string }): Promise<ServiceResponse<Sloth>> {
    return this.slothsRepo.getOne(where);
  }

  async createSloth(createSlothDto: CreateSlothDto): Promise<ServiceResponse<Sloth>> {
    const { caption, description, image_url: imageUrl, tags } = createSlothDto;
    return this.slothsRepo.create({ caption, description, image_url: imageUrl, tags: { create: tags } });
  }

  async updateSloth(id: string, updateSlothDto: UpdateSlothDto): Promise<ServiceResponse<Sloth>> {
    return this.slothsRepo.update(id, updateSlothDto);
  }

  async deleteSloth(id: string): Promise<ServiceResponse<Sloth>> {
    return this.slothsRepo.delete(id);
  }

  async updateSlothRating(
    updateSlothRatingDto: UpdateSlothRatingDto
  ): Promise<ServiceResponse<Pick<Sloth, 'id' | 'rating'>>> {
    return this.slothsRepo.updateRating(updateSlothRatingDto);
  }

  async createTag(createTagDto: Tag): Promise<ServiceResponse<Tag>> {
    return this.slothsRepo.createTag(createTagDto);
  }

  async deleteTag(tag: Tag): Promise<ServiceResponse<Tag>> {
    return this.slothsRepo.deleteTag(tag);
  }
}
