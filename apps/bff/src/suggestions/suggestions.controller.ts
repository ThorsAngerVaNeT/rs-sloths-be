import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  Query,
  Req,
  UseGuards,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { join } from 'path';
import { RequestWithUser } from '../app.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PublicFileInterceptor } from '../interceptors/public-file.interceptor';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionRatingDto } from './dto/update-suggestion-rating.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { ROLE } from '../users/entities/user.entity';
import { Roles } from '../rbac/roles.decorator';
import { getOrderBy, getWhere } from '../common/utils';
import { SuggestionsQueryDto } from './dto/suggestions-query.dto';
import { SuggestionsService } from './suggestions.service';

@UseGuards(JwtAuthGuard)
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

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
    const imageUrl = file ? join('suggestions-files', file.filename) : null;
    return this.suggestionsService.create(createSuggestionDto, user, imageUrl);
  }

  @Get()
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async findAll(@Req() req: RequestWithUser, @Query() queryParams: SuggestionsQueryDto) {
    const {
      user: { id: userId },
    } = req;

    const { page, limit, filter: filterValues = [], order = '', searchText } = queryParams;

    const where = getWhere({
      searchText,
      searchFields: ['description'],
      filterValues,
      filterFields: ['status'],
    });

    const orderBy = getOrderBy(order);

    const conditions = {
      page,
      limit,
      ...(where && { where }),
      ...(orderBy && { orderBy }),
      userId,
    };

    return this.suggestionsService.findAll(conditions);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(ROLE.admin, ROLE.user)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.suggestionsService.findOne(id);
  }

  @Delete(':id')
  @Roles(ROLE.admin)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.suggestionsService.remove(id);
  }

  @Put(':id')
  @Roles(ROLE.admin)
  @HttpCode(200)
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() updateSuggestionDto: UpdateSuggestionDto) {
    return this.suggestionsService.update(id, updateSuggestionDto);
  }

  @Put(':id/rating')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async updateRating(
    @Param('id', ParseUUIDPipe) suggestionId: string,
    @Body() updateSuggestionRatingDto: UpdateSuggestionRatingDto
  ) {
    return this.suggestionsService.updateRating(suggestionId, updateSuggestionRatingDto);
  }
}
