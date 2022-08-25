import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  HttpException,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ServiceResponse } from '../app.interfaces';
import { CreateSlothDto } from './dto/create-sloth.dto';
import { UpdateSlothRatingDto } from './dto/update-sloth-rating.dto';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { Sloth } from './entities/sloth.entity';

@UseGuards(JwtAuthGuard)
@Controller('sloths')
export class SlothsController {
  constructor(
    @Inject('SLOTHS')
    private readonly client: ClientProxy
  ) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          callback(null, `${randomUUID()}${fileExtName}`);
        },
      }),
    })
  )
  @Post()
  @HttpCode(201)
  async create(@UploadedFile() file: Express.Multer.File, @Body() createSlothDto: CreateSlothDto) {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>({ cmd: 'create_sloth' }, { ...createSlothDto, image_url: file.filename })
    );
    return sloth.data;
  }

  @Get()
  @HttpCode(200)
  async findAll(@Query('_page') page: string, @Query('_limit') limit: string) {
    const sloths = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth[]>>({ cmd: 'get_sloths' }, { page, limit })
    );
    return sloths.data;
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'get_sloth' }, id));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() updateSlothDto: UpdateSlothDto) {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>({ cmd: 'update_sloth' }, { ...updateSlothDto, id })
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'delete_sloth' }, id));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Put(':id/rating')
  @HttpCode(200)
  async updateRating(@Param('id') id: string, @Body() updateSlothRatingDto: UpdateSlothRatingDto) {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Pick<Sloth, 'id' | 'rating'>>>(
        { cmd: 'update_rating' },
        { ...updateSlothRatingDto, slothId: id }
      )
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }
}
