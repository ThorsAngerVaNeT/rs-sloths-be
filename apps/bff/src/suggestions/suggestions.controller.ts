/* eslint-disable class-methods-use-this */
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
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from 'src/app.interfaces';
import { PublicFileInterceptor } from 'src/public-file.interceptor';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { Suggestion } from './entities/suggestion.entity';

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    @Inject('SUGGESTIONS')
    private readonly client: ClientProxy,
    private configService: ConfigService
  ) {}

  @UseInterceptors(PublicFileInterceptor('suggestions/'))
  @Post()
  async create(@UploadedFile() file: Express.Multer.File, @Body() createSuggestionDto: CreateSuggestionDto) {
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
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
