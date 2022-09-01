import { Prisma } from '@prisma/client';

export interface ServiceResponse<T> {
  status: number;
  error?: string;
  data?: T | undefined;
}

export interface GetAllConditions {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
  cursor?: Prisma.GameWhereUniqueInput & Prisma.GameResultWhereUniqueInput;
  where?: Prisma.GameWhereInput & Prisma.GameResultWhereInput;
  orderBy?: Prisma.GameOrderByWithRelationInput & Prisma.GameResultOrderByWithRelationInput;
  userId?: string;
}

export interface GetAll<T> {
  items: T[];
  count: number;
}
