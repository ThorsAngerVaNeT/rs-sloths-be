import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpCode,
  Query,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ParamIdDto } from '../common/param-id.dto';
import { RequestWithUser, ServiceResponse } from '../app.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { QueryDto } from '../common/query.dto';
import { PublicFileInterceptor } from '../public-file.interceptor';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionRatingDto } from './dto/update-suggestion-rating.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { Suggestion } from './entities/suggestion.entity';

@UseGuards(JwtAuthGuard)
@Controller('suggestions')
export class SuggestionsController {
  constructor(
    @Inject('SUGGESTIONS')
    private readonly client: ClientProxy,
    private configService: ConfigService
  ) {}

  @UseInterceptors(PublicFileInterceptor('suggestion-files/'))
  @Post()
  @HttpCode(201)
  async create(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() createSuggestionDto: CreateSuggestionDto
  ) {
    const { user } = req;
    const imageUrl = file ? `${this.configService.get('BFF_URL')}suggestion-files/${file.filename}` : null;
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

  @Get()
  @HttpCode(200)
  async findAll(@Req() req: RequestWithUser, @Query() queryParams: QueryDto) {
    const {
      user: { id: userId },
    } = req;
    const { page, limit, filter, order } = queryParams;
    const suggestions = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion[]>>(
        { cmd: 'get_suggestions' },
        {
          page,
          limit,
          ...(filter && { where: JSON.parse(filter) }),
          ...(order && { orderBy: JSON.parse(order) }),
          userId,
        }
      )
    );
    return suggestions.data;
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param() paramId: ParamIdDto) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'get_suggestion' }, paramId.id)
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param() paramId: ParamIdDto) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'delete_suggestion' }, paramId.id)
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  @Put(':id')
  @HttpCode(200)
  async updateStatus(@Param() paramId: ParamIdDto, @Body() updateSuggestionDto: UpdateSuggestionDto) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>(
        { cmd: 'update_status' },
        { ...updateSuggestionDto, id: paramId.id }
      )
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  @Put(':id/rating')
  @HttpCode(200)
  async updateRating(@Param() paramId: ParamIdDto, @Body() updateSuggestionRatingDto: UpdateSuggestionRatingDto) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Pick<Suggestion, 'id' | 'rating'>>>(
        { cmd: 'update_rating' },
        { ...updateSuggestionRatingDto, suggestionId: paramId.id }
      )
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }
}
