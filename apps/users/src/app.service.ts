import { Injectable } from '@nestjs/common';
import { Prisma, TodayUserSloth, User } from '@prisma/client';
import { UsersRepo } from './app.db.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { GetAllConditions, ServiceResponse, UsersAll } from './app.interfaces';
import { PrismaService } from './prisma/prisma.service';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class AppService {
  private usersRepo: UsersRepo;

  constructor() {
    this.usersRepo = new UsersRepo(new PrismaService());
  }

  async getUsers(params: GetAllConditions): Promise<ServiceResponse<UsersAll>> {
    return this.usersRepo.getAll(params);
  }

  async getUser(where: { id: string }): Promise<ServiceResponse<User>> {
    return this.usersRepo.getOne(where);
  }

  async createUser(createUserDto: CreateUserDto): Promise<ServiceResponse<User>> {
    return this.usersRepo.create(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ServiceResponse<User>> {
    return this.usersRepo.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<ServiceResponse<User>> {
    return this.usersRepo.delete(id);
  }

  async validateUser(userData: ValidateUserDto): Promise<ServiceResponse<User>> {
    return this.usersRepo.validate(userData);
  }

  async getTodaySloth(where: Prisma.TodayUserSlothWhereUniqueInput): Promise<ServiceResponse<TodayUserSloth>> {
    return this.usersRepo.getTodaySloth(where);
  }

  async updateTodaySloth(data: Prisma.TodayUserSlothCreateManyInput): Promise<ServiceResponse<TodayUserSloth>> {
    return this.usersRepo.updateTodaySloth(data);
  }
}
