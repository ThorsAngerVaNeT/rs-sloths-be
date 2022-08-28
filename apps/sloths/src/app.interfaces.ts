import { Prisma, Sloth, Tag } from '@prisma/client';

export interface ServiceResponse<T> {
  status: number;
  error?: string;
  data?: T | undefined;
}

export interface SlothUserRating {
  slothId: string;
  userId: string;
  rate: number;
}

export interface GetAllConditions {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
  cursor?: Prisma.SlothWhereUniqueInput;
  where?: Prisma.SlothWhereInput;
  orderBy?: Prisma.SlothOrderByWithRelationInput;
  userId?: string;
}

export interface SlothsAll {
  items: Sloth[];
  count: number;
}

export type TagsValueList = Omit<Tag, 'slothId'>[];
