import { HttpStatus } from '@nestjs/common';
import { Prisma, Sloth } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GetAllConditions, ServiceResponse, SlothsAll } from './app.interfaces';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { PrismaService } from './prisma/prisma.service';

export class SlothsRepo {
  constructor(private prisma: PrismaService) {}

  public async getAll(params: GetAllConditions): Promise<ServiceResponse<SlothsAll>> {
    const { page = 1, limit: take = undefined, cursor, where, orderBy } = params;

    const skip = take ? (page - 1) * take : undefined;

    const conditions = {
      skip,
      take,
      cursor,
      where,
      orderBy,
    };
    const [count, items] = await this.prisma.$transaction([
      this.prisma.sloth.count(conditions),
      this.prisma.sloth.findMany(conditions),
    ]);

    return { data: { count, items }, status: HttpStatus.OK };
  }

  public async getOne(where: Prisma.SlothWhereUniqueInput): Promise<ServiceResponse<Sloth>> {
    const data = await this.prisma.sloth.findUnique({
      where,
    });

    if (!data) {
      return { error: `Sloth "${where.id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    return { data, status: HttpStatus.OK };
  }

  public async create(data: Omit<Prisma.SlothCreateInput, 'image_url'>): Promise<ServiceResponse<Sloth>> {
    const newSloth = await this.prisma.sloth.create({
      data: { ...data, image_url: 'http://localhost:5173/winner1.png' },
    });
    return { data: newSloth, status: HttpStatus.CREATED };
  }

  public async update(id: string, updateSlothDto: UpdateSlothDto): Promise<ServiceResponse<Sloth>> {
    const where: Prisma.SlothWhereUniqueInput = { id };
    const data: Prisma.SlothUpdateInput = updateSlothDto;

    try {
      const sloth = await this.prisma.sloth.update({
        data,
        where,
      });

      return { data: sloth, status: HttpStatus.CREATED };
    } catch (error) {
      return SlothsRepo.errorHandler(error, id);
    }
  }

  public async delete(id: string): Promise<ServiceResponse<Sloth>> {
    const where: Prisma.SlothWhereUniqueInput = { id };
    try {
      await this.prisma.sloth.delete({
        where,
      });

      return { status: HttpStatus.NO_CONTENT };
    } catch (error) {
      return SlothsRepo.errorHandler(error, id);
    }
  }

  static errorHandler(error: Error, id: string) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return { error: `Sloth "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }
    return { error: error.message, status: HttpStatus.INTERNAL_SERVER_ERROR };
  }
}
