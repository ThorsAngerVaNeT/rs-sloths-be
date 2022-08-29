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
  BadRequestException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ParamIdDto } from 'src/common/param-id.dto';
import { RequestWithUser, ServiceResponse } from '../app.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { QueryDto } from '../common/query.dto';
import { PublicFileInterceptor } from '../public-file.interceptor';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { Suggestion } from './entities/suggestion.entity';

@UseGuards(JwtAuthGuard)
@Controller('suggestions')
export class SuggestionsController {
  constructor(
    @Inject('SUGGESTIONS')
    private readonly client: ClientProxy,
    private configService: ConfigService
  ) {}

  @UseInterceptors(PublicFileInterceptor('suggestions/'))
  @Post()
  @HttpCode(201)
  async create(@UploadedFile() file: Express.Multer.File, @Body() createSuggestionDto: CreateSuggestionDto) {
    if (!file) throw new BadRequestException('You should provide a file');
    const imageUrl = `${this.configService.get('BFF_URL')}${file.filename}`;
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>(
        { cmd: 'create_suggestion' },
        { createSuggestionDto, image_url: imageUrl }
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
  async findOne(@Param('id') id: ParamIdDto) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'get_suggestion' }, id)
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: ParamIdDto) {
    const suggestion = await firstValueFrom(
      this.client.send<ServiceResponse<Suggestion>>({ cmd: 'delete_suggestion' }, id)
    );
    if (suggestion.error) {
      throw new HttpException(suggestion.error, suggestion.status);
    }

    return suggestion.data;
  }
}
