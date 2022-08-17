import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './entities/user.entity';

@UsePipes(new ValidationPipe())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_users' })
  getUsers(): User[] {
    return this.appService.getUsers();
  }

  @MessagePattern({ cmd: 'get_user' })
  getUser(id: string): User | undefined {
    return this.appService.getUser(id);
  }

  @MessagePattern({ cmd: 'create_user' })
  createUser(createUserDto: CreateUserDto): User {
    const { name, email } = createUserDto;
    return this.appService.createUser({ name, email });
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUser(id: string, updateUserDto: UpdateUserDto): User | undefined {
    const { name, email } = updateUserDto;
    return this.appService.updateUser(id, { id, name, email });
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(id: string): boolean | undefined {
    return this.appService.deleteUser(id);
  }
}
