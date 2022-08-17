import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  OnApplicationBootstrap,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController implements OnApplicationBootstrap {
  constructor(
    @Inject('USERS')
    private readonly client: ClientProxy,
    private readonly usersService: UsersService
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.client.send<User>({ cmd: 'create_user' }, createUserDto);
  }

  @Get()
  findAll() {
    return this.client.send<User[]>({ cmd: 'get_users' }, { page: 1, items: 10 });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.client.send<User>({ cmd: 'get_user' }, id);
    if (!user) throw new NotFoundException();

    return user;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.client.send<User>({ cmd: 'get_user' }, { ...updateUserDto, id });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send<User>({ cmd: 'delete_user' }, id);
  }
}
