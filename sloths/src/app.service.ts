import { Injectable } from '@nestjs/common';
import { Sloth } from './entities/sloth.entity';
import { SlothsRepo } from './app.memory.repository';
import { CreateSlothDto } from './dto/create-sloth-dto';
import { UpdateSlothDto } from './dto/update-sloth-dto';
import { ServiceResponse } from './app.interfaces';

@Injectable()
export class AppService {
  private slothsRepo: SlothsRepo;

  constructor() {
    this.slothsRepo = new SlothsRepo();
  }

  getSloths(page: number, limit: number): ServiceResponse<Sloth[]> {
    return this.slothsRepo.getAll(page, limit);
  }

  getSloth(id: string): ServiceResponse<Sloth> {
    return this.slothsRepo.getOne(id);
  }

  createSloth(createSlothDto: CreateSlothDto): ServiceResponse<Sloth> {
    return this.slothsRepo.create(createSlothDto);
  }

  updateSloth(id: string, updateSlothDto: UpdateSlothDto): ServiceResponse<Sloth> {
    return this.slothsRepo.update(id, updateSlothDto);
  }

  deleteSloth(id: string): ServiceResponse<Sloth> {
    return this.slothsRepo.delete(id);
  }
}
