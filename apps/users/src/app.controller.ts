import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma, TodayUserSloth, User } from '@prisma/client';
import { GetAllConditions, ServiceResponse, UsersAll } from './app.interfaces';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ValidateUserDto } from './dto/validate-user.dto';

@UsePipes(new ValidationPipe())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_users' })
  async getUsers(params: GetAllConditions): Promise<ServiceResponse<UsersAll>> {
    return this.appService.getUsers(params);
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(id: string): Promise<ServiceResponse<User>> {
    return this.appService.getUser({ id });
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(createUserDto: CreateUserDto): Promise<ServiceResponse<User>> {
    const { name, github } = createUserDto;
    return this.appService.createUser({ name, github });
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

  @MessagePattern({ cmd: 'validate' })
  async validateUser(userData: ValidateUserDto): Promise<ServiceResponse<User>> {
    return this.appService.validateUser(userData);
  }

  @MessagePattern({ cmd: 'get_today_sloth' })
  async getTodaySloth(id: string): Promise<ServiceResponse<TodayUserSloth>> {
    return this.appService.getTodaySloth({ userId: id });
  }

  @MessagePattern({ cmd: 'update_today_sloth' })
  async updateTodaySloth(data: Prisma.TodayUserSlothCreateManyInput): Promise<ServiceResponse<TodayUserSloth>> {
    return this.appService.updateTodaySloth(data);
  }
}
