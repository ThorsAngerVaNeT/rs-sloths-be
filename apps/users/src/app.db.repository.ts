import { HttpStatus } from '@nestjs/common';
import { Prisma, TodayUserSloth, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GetAllConditions, ServiceResponse, UsersAll } from './app.interfaces';
import { UpdateUserDto } from './dto/update-user-dto';
import { ValidateUserDto } from './dto/validate-user.dto';
import { PrismaService } from './prisma/prisma.service';

export class UsersRepo {
  constructor(private prisma: PrismaService) {}

  public async getAll(params: GetAllConditions): Promise<ServiceResponse<UsersAll>> {
    const { page = 1, limit, cursor, where, orderBy } = params;

    const take = limit || undefined;
    const skip = take ? (page - 1) * take : undefined;

    const conditions = {
      cursor,
      where,
      orderBy,
    };
    const [count, items] = await this.prisma.$transaction([
      this.prisma.user.count(conditions),
      this.prisma.user.findMany({ ...conditions, skip, take }),
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
      return UsersRepo.errorHandler(error, id);
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
      return UsersRepo.errorHandler(error, id);
    }
  }

  public async validate(userData: ValidateUserDto): Promise<ServiceResponse<User>> {
    const where = { github: userData.github };
    const data = await this.prisma.user.upsert({
      where,
      update: { avatar_url: userData.avatar_url },
      create: userData,
    });
    return { data, status: HttpStatus.OK };
  }

  static errorHandler(error: Error, id: string) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return { error: `User "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }
    return { error: error.message, status: HttpStatus.INTERNAL_SERVER_ERROR };
  }

  public async getTodaySloth(where: Prisma.TodayUserSlothWhereUniqueInput): Promise<ServiceResponse<TodayUserSloth>> {
    const data = await this.prisma.todayUserSloth.findUnique({
      where,
    });

    if (!data) {
      return { error: `User "${where.userId}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    return { data, status: HttpStatus.OK };
  }

  public async updateTodaySloth(data: Prisma.TodayUserSlothCreateManyInput): Promise<ServiceResponse<TodayUserSloth>> {
    const result = await this.prisma.todayUserSloth.upsert({
      where: { SlothUser: data },
      update: { ...data },
      create: { ...data },
    });

    if (!result) {
      return { error: `User "${data.userId}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    return { data: result, status: HttpStatus.OK };
  }
}
