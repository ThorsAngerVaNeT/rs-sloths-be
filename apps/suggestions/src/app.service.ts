import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Suggestion, SuggestionUserRating } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateSuggestionRatingDto } from './dto/update-suggestion-rating.dto';
import { GetAllConditions, ServiceResponse, SuggestionsAll } from './app.interfaces';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  static errorHandler(error: Error, entity: string, id: string) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return {
        error: `${entity} "${id}" not found!`,
        status: HttpStatus.NOT_FOUND,
      };
    }
    return { error: error.message, status: HttpStatus.INTERNAL_SERVER_ERROR };
  }

  public async getAll(params: GetAllConditions): Promise<ServiceResponse<SuggestionsAll>> {
    const { page = 1, limit, cursor, where, orderBy, userId } = params;

    const take = limit || undefined;
    const skip = take ? (page - 1) * take : undefined;
    const conditions = {
      cursor,
      where,
      orderBy,
    };
    const include: Prisma.SuggestionInclude = {
      ratings: {
        where: {
          userId,
        },
        select: {
          rate: true,
        },
      },
    };

    const [count, items] = await this.prisma.$transaction([
      this.prisma.suggestion.count(conditions),
      this.prisma.suggestion.findMany({
        ...conditions,
        skip,
        take,
        include,
      }),
    ]);

    return { data: { count, items }, status: HttpStatus.OK };
  }

  public async getOne(where: Prisma.SuggestionWhereUniqueInput): Promise<ServiceResponse<Suggestion>> {
    const data = await this.prisma.suggestion.findUnique({
      where,
    });

    if (!data) {
      return {
        error: `Suggestion "${where.id}" not found!`,
        status: HttpStatus.NOT_FOUND,
      };
    }

    return { data, status: HttpStatus.OK };
  }

  public async create(data: Prisma.SuggestionCreateInput): Promise<ServiceResponse<Suggestion>> {
    const newSuggestion = await this.prisma.suggestion.create({
      data,
    });
    return { data: newSuggestion, status: HttpStatus.CREATED };
  }

  public async updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<ServiceResponse<Suggestion>> {
    const where: Prisma.SuggestionWhereUniqueInput = { id };
    const data: Prisma.SuggestionUpdateInput = updateStatusDto;

    try {
      const suggestion = await this.prisma.suggestion.update({
        data,
        where,
      });

      return { data: suggestion, status: HttpStatus.OK };
    } catch (error) {
      return AppService.errorHandler(error, 'Sloth', id);
    }
  }

  public async delete(id: string): Promise<ServiceResponse<Suggestion>> {
    const where: Prisma.SuggestionWhereUniqueInput = { id };
    try {
      await this.prisma.suggestion.delete({
        where,
      });

      return { status: HttpStatus.NO_CONTENT };
    } catch (error) {
      return AppService.errorHandler(error, 'Suggestion', id);
    }
  }

  public async updateRating({
    suggestionId,
    userId,
    rate,
  }: UpdateSuggestionRatingDto): Promise<ServiceResponse<Pick<Suggestion, 'id' | 'rating'>>> {
    const suggestion = await this.getOne({ id: suggestionId });

    if (!suggestion.data) return suggestion;

    const where = { SuggestionUser: { suggestionId, userId } };
    await this.prisma.suggestionUserRating.upsert({
      where,
      update: { rate },
      create: { suggestionId, userId, rate },
    });

    const ratings = await this.prisma.suggestionUserRating.findMany({ where: { suggestionId } });
    const calculatedRating =
      ratings.reduce((acc: number, cur: SuggestionUserRating) => acc + cur.rate, 0) / ratings.length;

    await this.prisma.suggestion.update({
      where: {
        id: suggestionId,
      },
      data: { rating: calculatedRating },
    });

    return { data: { id: suggestionId, rating: calculatedRating }, status: HttpStatus.OK };
  }
}
