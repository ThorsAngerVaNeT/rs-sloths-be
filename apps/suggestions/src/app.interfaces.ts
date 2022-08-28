import { Prisma, Suggestion } from '@prisma/client';

export interface ServiceResponse<T> {
  status: number;
  error?: string;
  data?: T | undefined;
}

export interface SuggestionUserRating {
  suggestionId: string;
  userId: string;
  rate: number;
}

export interface GetAllConditions {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
  cursor?: Prisma.SuggestionWhereUniqueInput;
  where?: Prisma.SuggestionWhereInput;
  orderBy?: Prisma.SlothOrderByWithRelationInput;
  userId?: string;
}

export interface SuggestionsAll {
  items: Suggestion[];
  count: number;
}
