import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepo } from './app.db.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ServiceResponse } from './app.interfaces';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private usersRepo: UsersRepo;

  constructor() {
    this.usersRepo = new UsersRepo(new PrismaService());
  }

  async getUsers(page: number, limit: number): Promise<ServiceResponse<User[]>> {
    return this.usersRepo.getAll({});
  }

  async getUser(where: { id: string }): Promise<ServiceResponse<User>> {
    return this.usersRepo.getOne(where);
  }

  async createUser(createUserDto: CreateUserDto): Promise<ServiceResponse<User>> {
    return this.usersRepo.create({ ...createUserDto, password: 'def', role: 'USER' });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ServiceResponse<User>> {
    return this.usersRepo.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<ServiceResponse<User>> {
    return this.usersRepo.delete(id);
  }
}
