import { HttpStatus } from '@nestjs/common';
import { Prisma, Sloth, Tag } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GetAllConditions, ServiceResponse, SlothsAll, SlothUserRating, TagsValueList } from './app.interfaces';
import { UpdateSlothRatingDto } from './dto/update-sloth-rating.dto';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { PrismaService } from './prisma/prisma.service';

export class SlothsRepo {
  constructor(private prisma: PrismaService) {}

  static errorHandler(error: Error, entity: string, id: string) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return { error: `${entity} "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }
    return { error: error.message, status: HttpStatus.INTERNAL_SERVER_ERROR };
  }

  public async getAll(params: GetAllConditions): Promise<ServiceResponse<SlothsAll>> {
    const { page = 1, limit, cursor, where, orderBy, userId } = params;

    const take = limit || undefined;
    const skip = take ? (page - 1) * take : undefined;
    const conditions = {
      cursor,
      where,
      orderBy,
    };
    const include: Prisma.SlothInclude = {
      tags: {
        select: {
          value: true,
        },
      },
      ratings: {
        where: {
          userId,
        },
      },
    };

    const [count, items] = await this.prisma.$transaction([
      this.prisma.sloth.count(conditions),
      this.prisma.sloth.findMany({
        ...conditions,
        skip,
        take,
        include,
      }),
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

  public async create(data: Prisma.SlothCreateInput): Promise<ServiceResponse<Sloth>> {
    const newSloth = await this.prisma.sloth.create({
      data,
    });
    return { data: newSloth, status: HttpStatus.CREATED };
  }

  public async update(id: string, updateSlothDto: UpdateSlothDto): Promise<ServiceResponse<Sloth>> {
    const { tags, ...restUpdateSlothDto } = updateSlothDto;
    const dataTags = tags.map((tag) => ({ ...tag, slothId: id }));
    const where: Prisma.SlothWhereUniqueInput = { id };
    const data: Prisma.SlothUpdateInput = restUpdateSlothDto;

    try {
      const [, , updateSloth] = await this.prisma.$transaction([
        this.prisma.tag.deleteMany({ where: { slothId: id } }),
        this.prisma.tag.createMany({ data: dataTags }),
        this.prisma.sloth.update({
          data,
          where,
          include: {
            tags: {
              select: {
                value: true,
              },
            },
          },
        }),
      ]);

      return { data: updateSloth, status: HttpStatus.OK };
    } catch (error) {
      return SlothsRepo.errorHandler(error, 'Sloth', id);
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
      return SlothsRepo.errorHandler(error, 'Sloth', id);
    }
  }

  public async updateRating({
    slothId,
    userId,
    rate,
  }: UpdateSlothRatingDto): Promise<ServiceResponse<Pick<Sloth, 'id' | 'rating'>>> {
    const where = { SlothUser: { slothId, userId } };
    await this.prisma.slothUserRating.upsert({
      where,
      update: { rate },
      create: { slothId, userId, rate },
    });

    const ratings = await this.prisma.slothUserRating.findMany({ where: { slothId } });
    const calculatedRating = ratings.reduce((acc: number, cur: SlothUserRating) => acc + cur.rate, 0) / ratings.length;

    await this.prisma.sloth.update({
      where: {
        id: slothId,
      },
      data: { rating: calculatedRating },
    });

    return { data: { id: slothId, rating: calculatedRating }, status: HttpStatus.OK };
  }

  public async getUniqueTags(): Promise<ServiceResponse<TagsValueList>> {
    const data = await this.prisma.tag.findMany({ select: { value: true }, distinct: ['value'] });

    return { data, status: HttpStatus.OK };
  }
}
