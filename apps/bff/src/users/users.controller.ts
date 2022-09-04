import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ROLE } from './entities/user.entity';
import { RequestWithUser } from '../app.interfaces';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from '../rbac/roles.decorator';
import { getOrderBy, getWhere } from '../common/utils';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(ROLE.admin)
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(ROLE.admin)
  @HttpCode(200)
  async findAll(@Query() queryParams: UsersQueryDto) {
    const { page, limit, filter: filterValues = [], order = '', searchText } = queryParams;

    const where = getWhere({
      searchText,
      searchFields: ['name', 'github'],
      filterValues,
      filterFields: ['role'],
    });

    const orderBy = getOrderBy(order);

    const conditions = {
      page,
      limit,
      ...(where && { where }),
      ...(orderBy && { orderBy }),
    };

    return this.usersService.findAll(conditions);
  }

  // eslint-disable-next-line class-methods-use-this
  @Get('/session')
  @Roles(ROLE.user, ROLE.admin)
  @HttpCode(200)
  async getSession(@Req() req: RequestWithUser) {
    const { user } = req;
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }

    return user;
  }

  @Put('/profile')
  @Roles(ROLE.user, ROLE.admin)
  @HttpCode(200)
  async updateProfile(@Req() req: RequestWithUser, @Body() updateProfileDto: UpdateProfileDto) {
    const { user } = req;
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }

    if (user.id !== updateProfileDto.id) throw new ForbiddenException();

    return this.usersService.updateProfile({ ...updateProfileDto, id: user.id });
  }

  @Get('/todaySloth')
  @Roles(ROLE.user, ROLE.admin)
  @HttpCode(200)
  async findTodaySloth(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.usersService.findTodaySloth(user);
  }

  @Get(':id')
  @Roles(ROLE.admin)
  @HttpCode(200)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(ROLE.admin)
  @HttpCode(200)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(ROLE.admin)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
