import { Prisma, User } from '@prisma/client';

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
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}

export interface UsersAll {
  items: User[];
  count: number;
}

export interface UserValidateData {
  name: string;
  github: string;
}
