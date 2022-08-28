/* eslint-disable class-methods-use-this */
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    @Inject('SUGGESTIONS')
    private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createSuggestionDto: CreateSuggestionDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuggestionDto: UpdateSuggestionDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
