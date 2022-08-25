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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ServiceResponse, UsersAll } from '../app.interfaces';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS')
    private readonly client: ClientProxy
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'create_user' }, createUserDto));
    return user.data;
  }

  @Get()
  @HttpCode(200)
  async findAll(
    @Query('_page') page: string,
    @Query('_limit') limit: string,
    @Query('filter') filter: string,
    @Query('order') order: string
  ) {
    const users = await firstValueFrom(
      this.client.send<ServiceResponse<UsersAll>>(
        { cmd: 'get_users' },
        {
          ...(page && { page: +page }),
          ...(limit && { limit: +limit }),
          ...(filter && { where: JSON.parse(filter) }),
          ...(order && { orderBy: JSON.parse(order) }),
        }
      )
    );
    return users.data;
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'get_user' }, id));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
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
  async remove(@Param('id') id: string) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'delete_user' }, id));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }
}
