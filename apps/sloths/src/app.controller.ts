import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ServiceResponse } from './app.interfaces';
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
  getSloths({ page = 1, limit = 0 }: { page: number; limit: number }): ServiceResponse<Sloth[]> {
    return this.appService.getSloths(page, limit);
  }

  @MessagePattern({ cmd: 'get_sloth' })
  getSloth(id: string): ServiceResponse<Sloth> {
    return this.appService.getSloth(id);
  }

  @MessagePattern({ cmd: 'create_sloth' })
  createSloth(createSlothDto: CreateSlothDto): ServiceResponse<Sloth> {
    const { caption, description } = createSlothDto;
    return this.appService.createSloth({ caption, description });
  }

  @MessagePattern({ cmd: 'update_sloth' })
  updateSloth(updateSlothDto: UpdateSlothDto): ServiceResponse<Sloth> {
    const { id } = updateSlothDto;
    return this.appService.updateSloth(id, updateSlothDto);
  }

  @MessagePattern({ cmd: 'delete_sloth' })
  deleteSloth(id: string): ServiceResponse<Sloth> {
    return this.appService.deleteSloth(id);
  }

  @MessagePattern({ cmd: 'update_rating' })
  updateSlothRating(updateSlothRatingDto: UpdateSlothRatingDto): ServiceResponse<Pick<Sloth, 'id' | 'rating'>> {
    return this.appService.updateSlothRating(updateSlothRatingDto);
  }
}
