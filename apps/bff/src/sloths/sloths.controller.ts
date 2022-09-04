import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Query,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PublicFileInterceptor } from '../public-file.interceptor';
import { RequestWithUser } from '../app.interfaces';
import { CreateSlothDto } from './dto/create-sloth.dto';
import { UpdateSlothRatingDto } from './dto/update-sloth-rating.dto';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { SlothsService } from './sloths.service';
import { Roles } from '../rbac/roles.decorator';
import { ROLE } from '../users/entities/user.entity';
import { getOrderBy, getWhere } from '../common/utils';
import { SlothsQueryDto } from './dto/sloths-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('sloths')
export class SlothsController {
  constructor(private slothsService: SlothsService) {}

  @UseInterceptors(PublicFileInterceptor())
  @Post()
  @Roles(ROLE.admin)
  @HttpCode(201)
  async create(@UploadedFile() file: Express.Multer.File, @Body() createSlothDto: CreateSlothDto) {
    if (!file) throw new BadRequestException('You should provide a file');
    const imageUrl = file.filename;
    const { tags, ...restCreateSlothDto } = createSlothDto;
    return this.slothsService.create({ ...restCreateSlothDto, ...(tags && { tags }) }, imageUrl);
  }

  @Get()
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async findAll(@Req() req: RequestWithUser, @Query() queryParams: SlothsQueryDto) {
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
    return this.slothsService.findAllTags();
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
    return this.slothsService.update(id, { ...restUpdateSlothDto, ...(tags && { tags }) }, imageUrl);
  }

  @Delete(':id')
  @Roles(ROLE.admin)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.slothsService.remove(id);
  }

  @Put(':id/rating')
  @Roles(ROLE.admin, ROLE.user)
  @HttpCode(200)
  async updateRating(@Param('id', ParseUUIDPipe) slothId: string, @Body() updateSlothRatingDto: UpdateSlothRatingDto) {
    return this.slothsService.updateRating(slothId, updateSlothRatingDto);
  }
}
