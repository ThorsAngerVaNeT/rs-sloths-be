import { HttpStatus } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GetAllConditions, ServiceResponse, UsersAll } from './app.interfaces';
import { UpdateUserDto } from './dto/update-user-dto';
import { PrismaService } from './prisma/prisma.service';

export class UsersRepo {
  constructor(private prisma: PrismaService) {}

  public async getAll(params: GetAllConditions): Promise<ServiceResponse<UsersAll>> {
    const { page = 1, limit: take = undefined, cursor, where, orderBy } = params;

    const skip = take ? (page - 1) * take : undefined;
    const [count, items] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
    ]);

    return { data: { count, items }, status: HttpStatus.OK };
  }

  public async getOne(where: Prisma.UserWhereUniqueInput): Promise<ServiceResponse<User>> {
    const data = await this.prisma.user.findUnique({
      where,
    });

    if (!data) {
      return { error: `User "${where.id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    return { data, status: HttpStatus.OK };
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
