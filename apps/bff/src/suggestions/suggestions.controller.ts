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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { join } from 'path';
import { RequestWithUser, ServiceResponse } from '../app.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { QueryDto } from '../common/query.dto';
import { PublicFileInterceptor } from '../public-file.interceptor';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionRatingDto } from './dto/update-suggestion-rating.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { Suggestion } from './entities/suggestion.entity';
import { ROLE } from '../users/entities/user.entity';
import { Roles } from '../rbac/roles.decorator';
import { getWhere } from '../common/utils';

@UseGuards(JwtAuthGuard)
@Controller('suggestions')
export class SuggestionsController {
  constructor(
    @Inject('SUGGESTIONS')
    private readonly client: ClientProxy,
    private configService: ConfigService
  ) {}

  @UseInterceptors(PublicFileInterceptor('suggestions-files'))
  @Post()
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(201)
  async create(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() createSuggestionDto: CreateSuggestionDto
  ) {
    const { user } = req;
    const imageUrl = file ? join('suggestion-files', file.filename) : null;
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
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async findAll(@Req() req: RequestWithUser, @Query() queryParams: QueryDto) {
    const {
      user: { id: userId },
    } = req;

    const { page, limit, filter: filterValues = [], order, searchText } = queryParams;

    const where = getWhere({
      searchText,
      searchFields: ['description'],
      filterValues,
      filterFields: ['status'],
    });
    const conditions = {
      page,
      limit,
      ...(where && { where }),
      ...(order && { orderBy: JSON.parse(order) }),
      userId,
    };

    const suggestions = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion[]>>({ cmd: 'get_suggestions' }, conditions)
    );
    return suggestions.data;
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(ROLE.admin, ROLE.user)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'get_suggestion' }, id)
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  @Delete(':id')
  @Roles(ROLE.admin)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'delete_suggestion' }, id)
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  @Put(':id')
  @Roles(ROLE.admin)
  @HttpCode(200)
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() updateSuggestionDto: UpdateSuggestionDto) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'update_status' }, { ...updateSuggestionDto, id })
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  @Put(':id/rating')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async updateRating(
    @Param('id', ParseUUIDPipe) suggestionId: string,
    @Body() updateSuggestionRatingDto: UpdateSuggestionRatingDto
  ) {
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
