/* eslint-disable max-lines-per-function */
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
  ParseUUIDPipe,
} from '@nestjs/common';
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
import { Tag } from './entities/tag.entity';
import { SlothsService } from './sloths.service';
import { Roles } from '../rbac/roles.decorator';
import { ROLE } from '../users/entities/user.entity';
import { getOrderBy, getWhere } from '../common/utils';

@UseGuards(JwtAuthGuard)
@Controller('sloths')
export class SlothsController {
  constructor(
    @Inject('SLOTHS')
    private readonly client: ClientProxy,
    private slothsService: SlothsService
  ) {}

  @UseInterceptors(PublicFileInterceptor())
  @Post()
  @Roles(ROLE.admin)
  @HttpCode(201)
  async create(@UploadedFile() file: Express.Multer.File, @Body() createSlothDto: CreateSlothDto) {
    if (!file) throw new BadRequestException('You should provide a file');
    const imageUrl = file.filename;
    const { tags, ...restCreateSlothDto } = createSlothDto;
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>(
        { cmd: 'create_sloth' },
        { ...restCreateSlothDto, ...(tags && { tags }), image_url: imageUrl }
      )
    );

    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Get()
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async findAll(@Req() req: RequestWithUser, @Query() queryParams: QueryDto) {
    const {
      user: { id: userId },
    } = req;
    const { page, limit, filter: filterValues = [], order = '', searchText } = queryParams;

    const where = getWhere({
      searchText,
      searchFields: ['caption', 'description'],
      filterValues,
      filterFields: [['tags', 'value']],
    });

    const orderBy = getOrderBy(order);

    const conditions = {
      page,
      limit,
      ...(where && { where }),
      ...(orderBy && { orderBy }),
      userId,
    };

    return this.slothsService.findAll(conditions);
  }

  @Get('/tags')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async findAllTags() {
    const tags = await firstValueFrom(this.client.send<ServiceResponse<Tag[]>>({ cmd: 'get_tags' }, {}));
    if (tags.error) {
      throw new HttpException(tags.error, tags.status);
    }

    return tags.data;
  }

  @Get(':id')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.slothsService.findOne(id);
  }

  @UseInterceptors(PublicFileInterceptor())
  @Put(':id')
  @Roles(ROLE.admin)
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateSlothDto: UpdateSlothDto
  ) {
    const imageUrl = file ? file.filename : updateSlothDto.image_url;
    const { tags, ...restUpdateSlothDto } = updateSlothDto;
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Sloth>>(
        { cmd: 'update_sloth' },
        { ...restUpdateSlothDto, ...(tags && { tags }), id, image_url: imageUrl }
      )
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Delete(':id')
  @Roles(ROLE.admin)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const sloth = await firstValueFrom(this.client.send<ServiceResponse<Sloth>>({ cmd: 'delete_sloth' }, id));
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }

  @Put(':id/rating')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async updateRating(@Param('id', ParseUUIDPipe) slothId: string, @Body() updateSlothRatingDto: UpdateSlothRatingDto) {
    const sloth = await firstValueFrom(
      this.client.send<ServiceResponse<Pick<Sloth, 'id' | 'rating'>>>(
        { cmd: 'update_rating' },
        { ...updateSlothRatingDto, slothId }
      )
    );
    if (sloth.error) {
      throw new HttpException(sloth.error, sloth.status);
    }

    return sloth.data;
  }
}
