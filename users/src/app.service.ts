import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepo } from './app.memory.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class AppService {
  private usersRepo: UsersRepo;

  constructor() {
    this.usersRepo = new UsersRepo();
  }

  getUsers(): User[] {
    return this.usersRepo.getAll();
  }

  getUser(id: string): User | undefined {
    return this.usersRepo.getOne(id);
  }

  createUser(createUserDto: CreateUserDto): User {
    return this.usersRepo.create(createUserDto);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): User | undefined {
    return this.usersRepo.update(id, updateUserDto);
  }

  deleteUser(id: string): boolean | undefined {
    return this.usersRepo.delete(id);
  }
}