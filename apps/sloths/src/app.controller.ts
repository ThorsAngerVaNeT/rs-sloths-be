import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GetAllConditions, ServiceResponse, SlothsAll } from './app.interfaces';
import { AppService } from './app.service';
import { CreateSlothDto } from './dto/create-sloth.dto';
import { UpdateSlothRatingDto } from './dto/update-sloth-rating.dto';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { Sloth } from './entities/sloth.entity';

@UsePipes(new ValidationPipe())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_sloths' })
  async getSloths(params: GetAllConditions): Promise<ServiceResponse<SlothsAll>> {
    return this.appService.getSloths(params);
  }

  @MessagePattern({ cmd: 'get_sloth' })
  async getSloth(id: string): Promise<ServiceResponse<Sloth>> {
    return this.appService.getSloth({ id });
  }

  @MessagePattern({ cmd: 'create_sloth' })
  async createSloth(createSlothDto: CreateSlothDto): Promise<ServiceResponse<Sloth>> {
    const { caption, description } = createSlothDto;
    return this.appService.createSloth({ caption, description });
  }

  @MessagePattern({ cmd: 'update_sloth' })
  async updateSloth(updateSlothDto: UpdateSlothDto): Promise<ServiceResponse<Sloth>> {
    const { id } = updateSlothDto;
    return this.appService.updateSloth(id, updateSlothDto);
  }

  @MessagePattern({ cmd: 'delete_sloth' })
  async deleteSloth(id: string): Promise<ServiceResponse<Sloth>> {
    return this.appService.deleteSloth(id);
  }

  @MessagePattern({ cmd: 'update_rating' })
  async updateSlothRating(
    updateSlothRatingDto: UpdateSlothRatingDto
  ): Promise<ServiceResponse<Pick<Sloth, 'id' | 'rating'>>> {
    return this.appService.updateSlothRating(updateSlothRatingDto);
  }
}
