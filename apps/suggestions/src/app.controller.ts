import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Suggestion } from '@prisma/client';
import { CreateSuggestionDto } from 'dto/create-suggestion.dto';
import { UpdateSuggestionRatingDto } from 'dto/update-suggestion-rating.dto';
import { GetAllConditions, ServiceResponse, SuggestionsAll } from './app.interfaces';
import { AppService } from './app.service';

@UsePipes(new ValidationPipe())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_suggestions' })
  async getSuggestions(params: GetAllConditions): Promise<ServiceResponse<SuggestionsAll>> {
    return this.appService.getAll(params);
  }

  @MessagePattern({ cmd: 'get_suggestion' })
  async getSuggestion(id: string): Promise<ServiceResponse<Suggestion>> {
    return this.appService.getOne({ id });
  }

  @MessagePattern({ cmd: 'create_suggestion' })
  async createSuggestion(createSuggestionDto: CreateSuggestionDto): Promise<ServiceResponse<Suggestion>> {
    return this.appService.create(createSuggestionDto);
  }

  @MessagePattern({ cmd: 'delete_suggestion' })
  async deleteSuggestion(id: string): Promise<ServiceResponse<Suggestion>> {
    return this.appService.delete(id);
  }

  @MessagePattern({ cmd: 'update_rating' })
  async updateSuggestionRating(
    updateSuggestionRatingDto: UpdateSuggestionRatingDto
  ): Promise<ServiceResponse<Pick<Suggestion, 'id' | 'rating'>>> {
    return this.appService.updateRating(updateSuggestionRatingDto);
  }
}
