import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetAllConditions, ServiceResponse } from '../app.interfaces';
import { User } from '../users/entities/user.entity';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionRatingDto } from './dto/update-suggestion-rating.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { Suggestion } from './entities/suggestion.entity';

@Injectable()
export class SuggestionsService {
  constructor(
    @Inject('SUGGESTIONS')
    private readonly client: ClientProxy
  ) {}

  async create(createSuggestionDto: CreateSuggestionDto, user: User, imageUrl: string | null) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>(
        { cmd: 'create_suggestion' },
        { ...createSuggestionDto, userId: user.id, image_url: imageUrl }
      )
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  async findAll(conditions: GetAllConditions) {
    const suggestions = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion[]>>({ cmd: 'get_suggestions' }, conditions)
    );
    return suggestions.data;
  }

  async findOne(id: string) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'get_suggestion' }, id)
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  async update(id: string, updateSuggestionDto: UpdateSuggestionDto) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'update_status' }, { ...updateSuggestionDto, id })
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  async remove(id: string) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'delete_suggestion' }, id)
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  async updateRating(
    suggestionId: string,
    updateSuggestionRatingDto: UpdateSuggestionRatingDto
  ): Promise<Pick<Suggestion, 'id' | 'rating'> | undefined> {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Pick<Suggestion, 'id' | 'rating'>>>(
        { cmd: 'update_rating' },
        { ...updateSuggestionRatingDto, suggestionId }
      )
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }
}
