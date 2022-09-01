import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  HttpException,
  HttpCode,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpStatus,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RequestWithUser, ServiceResponse, GetAll } from '../app.interfaces';
import { QueryDto } from '../common/query.dto';
import { SlothsService } from '../sloths/sloths.service';
import { TodayUserSloth } from './entities/todayUserSloth.dto';
import { MS_IN_ONE_DAY } from '../common/constants';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS')
    private readonly client: ClientProxy,
    private readonly slothService: SlothsService
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'create_user' }, createUserDto));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  @Get()
  @HttpCode(200)
  async findAll(@Query() queryParams: QueryDto) {
    const { page, limit, filter, order } = queryParams;
    const users = await firstValueFrom(
      this.client.send<ServiceResponse<GetAll<User>>>(
        { cmd: 'get_users' },
        { page, limit, ...(filter && { where: JSON.parse(filter) }), ...(order && { orderBy: JSON.parse(order) }) }
      )
    );
    return users.data;
  }

  // eslint-disable-next-line class-methods-use-this
  @Get('/session')
  @HttpCode(200)
  async getSession(@Req() req: RequestWithUser) {
    const { user } = req;
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }

    return user;
  }

  @Get('/todaySloth')
  @HttpCode(200)
  async findTodaySloth(@Req() req: RequestWithUser) {
    const { user } = req;
    const todaySloth = await firstValueFrom(
      this.client.send<ServiceResponse<TodayUserSloth>>({ cmd: 'get_today_sloth' }, user.id)
    );

    if (todaySloth.error && todaySloth.status !== HttpStatus.NOT_FOUND) {
      throw new HttpException(todaySloth.error, todaySloth.status);
    }

    const isRandomSlothNeeded =
      todaySloth.status === HttpStatus.NOT_FOUND ||
      Date.now() - +new Date(todaySloth.data?.updatedAt ?? 0) >= MS_IN_ONE_DAY;

    if (!isRandomSlothNeeded && todaySloth.data?.slothId) {
      return this.slothService.findOne(todaySloth.data?.slothId);
    }

    const sloth = await this.slothService.findRandom();

    if (!sloth) throw new NotFoundException();

    const todaySlothUpdate = await firstValueFrom(
      this.client.send<ServiceResponse<TodayUserSloth>>(
        { cmd: 'update_today_sloth' },
        { userId: user.id, slothId: sloth.id }
      )
    );
    if (todaySlothUpdate.error) {
      throw new HttpException(todaySlothUpdate.error, todaySlothUpdate.status);
    }

    return sloth;
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'get_user' }, id));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await firstValueFrom(
      this.client.send<ServiceResponse<User>>({ cmd: 'update_user' }, { ...updateUserDto, id })
    );
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'delete_user' }, id));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }
}
