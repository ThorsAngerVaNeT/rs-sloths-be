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
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PublicFileInterceptor } from 'src/public-file.interceptor';
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
    private readonly client: ClientProxy,
    private configService: ConfigService
  ) {}

  @UseInterceptors(PublicFileInterceptor)
  @Post()
  @HttpCode(201)
  async create(@UploadedFile() file: Express.Multer.File, @Body() createSlothDto: CreateSlothDto) {
    const imageUrl = `${this.configService.get('BFF_URL')}${file.filename}`;
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>({ cmd: 'create_sloth' }, { ...createSlothDto, image_url: imageUrl })
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

  @UseInterceptors(PublicFileInterceptor)
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateSlothDto: UpdateSlothDto
  ) {
    const imageUrl = `${this.configService.get('BFF_URL')}${file.filename}`;
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>({ cmd: 'update_sloth' }, { ...updateSlothDto, id, image_url: imageUrl })
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
