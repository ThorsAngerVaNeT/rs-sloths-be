import { HttpStatus } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GetAllConditions, ServiceResponse } from './app.interfaces';
import { UpdateUserDto } from './dto/update-user-dto';
import { PrismaService } from './prisma/prisma.service';

export class UsersRepo {
  constructor(private prisma: PrismaService) {}

  public async getAll(params: GetAllConditions): Promise<ServiceResponse<User[]>> {
    const { page = 1, limit: take = 10, cursor, where, orderBy } = params;

    const skip = (page - 1) * take;

    const res = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
    return { data: res, status: HttpStatus.OK };
  }

  public async getOne(where: Prisma.UserWhereUniqueInput): Promise<ServiceResponse<User>> {
    const user = await this.prisma.user.findUnique({
      where,
    });

    if (!user) {
      return { error: `User "${where.id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    return { data: user, status: HttpStatus.OK };
  }

  public async create(data: Prisma.UserCreateInput): Promise<ServiceResponse<User>> {
    const newUser = await this.prisma.user.create({
      data,
    });
    return { data: newUser, status: HttpStatus.CREATED };
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<ServiceResponse<User>> {
    const where: Prisma.UserWhereUniqueInput = { id };
    const data: Prisma.UserUpdateInput = updateUserDto;

    try {
      const user = await this.prisma.user.update({
        data,
        where,
      });

      return { data: user, status: HttpStatus.CREATED };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return { error: `User "${where.id}" not found!`, status: HttpStatus.NOT_FOUND };
      }
      throw error;
    }
  }

  public async delete(id: string): Promise<ServiceResponse<User>> {
    const where: Prisma.UserWhereUniqueInput = { id };
    try {
      await this.prisma.user.delete({
        where,
      });

      return { status: HttpStatus.NO_CONTENT };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return { error: `User "${where.id}" not found!`, status: HttpStatus.NOT_FOUND };
      }
      throw error;
    }
  }
}
