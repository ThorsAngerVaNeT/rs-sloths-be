import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { GetAllConditions, ServiceResponse } from './app.interfaces';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@UsePipes(new ValidationPipe())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_users' })
  async getUsers(params: GetAllConditions): Promise<ServiceResponse<User[]>> {
    return this.appService.getUsers(params);
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(id: string): Promise<ServiceResponse<User>> {
    return this.appService.getUser({ id });
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(createUserDto: CreateUserDto): Promise<ServiceResponse<User>> {
    const { name, email } = createUserDto;
    return this.appService.createUser({ name, email });
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(updateUserDto: UpdateUserDto): Promise<ServiceResponse<User>> {
    const { id } = updateUserDto;
    return this.appService.updateUser(id, updateUserDto);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(id: string): Promise<ServiceResponse<User>> {
    return this.appService.deleteUser(id);
  }
}
