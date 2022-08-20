import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ServiceResponse } from './app.interfaces';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './entities/user.entity';

@UsePipes(new ValidationPipe())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_users' })
  getUsers({ page = 1, limit = 0 }: { page: number; limit: number }): ServiceResponse<User[]> {
    return this.appService.getUsers(page, limit);
  }

  @MessagePattern({ cmd: 'get_user' })
  getUser(id: string): ServiceResponse<User> {
    return this.appService.getUser(id);
  }

  @MessagePattern({ cmd: 'create_user' })
  createUser(createUserDto: CreateUserDto): ServiceResponse<User> {
    const { name, email } = createUserDto;
    return this.appService.createUser({ name, email });
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUser(updateUserDto: UpdateUserDto): ServiceResponse<User> {
    const { id } = updateUserDto;
    return this.appService.updateUser(id, updateUserDto);
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(id: string): ServiceResponse<User> {
    return this.appService.deleteUser(id);
  }
}
