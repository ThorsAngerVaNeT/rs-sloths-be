import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepo } from './app.db.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { GetAllConditions, ServiceResponse, UsersAll, UserValidateData } from './app.interfaces';
import { PrismaService } from './prisma/prisma.service';

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
    return this.usersRepo.create({ ...createUserDto });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ServiceResponse<User>> {
    return this.usersRepo.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<ServiceResponse<User>> {
    return this.usersRepo.delete(id);
  }

  async validateUser(userData: UserValidateData): Promise<ServiceResponse<User>> {
    return this.usersRepo.validate(userData);
  }
}
