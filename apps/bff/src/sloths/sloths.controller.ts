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
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PublicFileInterceptor } from '../public-file.interceptor';
import { RequestWithUser, ServiceResponse } from '../app.interfaces';
import { CreateSlothDto } from './dto/create-sloth.dto';
import { UpdateSlothRatingDto } from './dto/update-sloth-rating.dto';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { Sloth } from './entities/sloth.entity';
import { QueryDto } from '../common/query.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { ParamIdDto } from '../common/param-id.dto';

@UseGuards(JwtAuthGuard)
@Controller('sloths')
export class SlothsController {
  constructor(
    @Inject('SLOTHS')
    private readonly client: ClientProxy,
    private configService: ConfigService
  ) {}

  @UseInterceptors(PublicFileInterceptor())
  @Post()
  @HttpCode(201)
  async create(@UploadedFile() file: Express.Multer.File, @Body() createSlothDto: CreateSlothDto) {
    if (!file) throw new BadRequestException('You should provide a file');
    const imageUrl = `${this.configService.get('BFF_URL')}${file.filename}`;
    const { tags, ...restCreateSlothDto } = createSlothDto;
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>(
        { cmd: 'create_sloth' },
        { ...restCreateSlothDto, ...(tags && { tags }), image_url: imageUrl }
      )
    );
    return sloth.data;
  }

  @Get()
  @HttpCode(200)
  async findAll(@Req() req: RequestWithUser, @Query() queryParams: QueryDto) {
    const {
      user: { id: userId },
    } = req;
    const { page, limit, filter, order } = queryParams;
    const sloths = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth[]>>(
        { cmd: 'get_sloths' },
        {
          page,
          limit,
          ...(filter && { where: JSON.parse(filter) }),
          ...(order && { orderBy: JSON.parse(order) }),
          userId,
        }
      )
    );
    return sloths.data;
  }

  @Get('/tags')
  @HttpCode(200)
  async findAllTags() {
    const tags = await firstValueFrom(this.client.send<ServiceResponse<Tag[]>>({ cmd: 'get_tags' }, {}));
    return tags.data;
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param() paramId: ParamIdDto) {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'get_sloth' }, paramId.id));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @UseInterceptors(PublicFileInterceptor())
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param() paramId: ParamIdDto,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateSlothDto: UpdateSlothDto
  ) {
    const imageUrl = file ? `${this.configService.get('BFF_URL')}${file.filename}` : updateSlothDto.image_url;
    const { tags, ...restUpdateSlothDto } = updateSlothDto;
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>(
        { cmd: 'update_sloth' },
        { ...restUpdateSlothDto, ...(tags && { tags }), id: paramId.id, image_url: imageUrl }
      )
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param() paramId: ParamIdDto) {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'delete_sloth' }, paramId.id));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Put(':id/rating')
  @HttpCode(200)
  async updateRating(@Param() paramId: ParamIdDto, @Body() updateSlothRatingDto: UpdateSlothRatingDto) {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Pick<Sloth, 'id' | 'rating'>>>(
        { cmd: 'update_rating' },
        { ...updateSlothRatingDto, slothId: paramId.id }
      )
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Post(':slothId/tag')
  @HttpCode(201)
  async createTag(@Param('slothId') slothId: string, @Body() createTagDto: CreateTagDto) {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Tag>>({ cmd: 'create_tag' }, { ...createTagDto, slothId })
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Delete(':slothId/tag/:tagId')
  @HttpCode(204)
  async removeTag(@Param('slothId') slothId: string, @Param('tagId') tagId: string) {
    const tag = await firstValueFrom(this.client.send<ServiceResponse<Tag>>({ cmd: 'delete_tag' }, { slothId, tagId }));
    if (tag.error) {
      throw new HttpException(tag.error, tag.status);
    }

    return tag.data;
  }
}
