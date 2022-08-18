import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepo } from './app.memory.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ServiceResponse } from './app.interfaces';

@Injectable()
export class AppService {
  private usersRepo: UsersRepo;

  constructor() {
    this.usersRepo = new UsersRepo();
  }

  getUsers(): ServiceResponse<User[]> {
    return this.usersRepo.getAll();
  }

  getUser(id: string): ServiceResponse<User> {
    return this.usersRepo.getOne(id);
  }

  createUser(createUserDto: CreateUserDto): ServiceResponse<User> {
    return this.usersRepo.create(createUserDto);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): ServiceResponse<User> {
    return this.usersRepo.update(id, updateUserDto);
  }

  deleteUser(id: string): ServiceResponse<User> {
    return this.usersRepo.delete(id);
  }
}
