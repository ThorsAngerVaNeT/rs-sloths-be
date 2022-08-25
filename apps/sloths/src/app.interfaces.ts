import { Prisma, Sloth } from '@prisma/client';

export interface ServiceResponse<T> {
  status: number;
  error?: string;
  data?: T | undefined;
}

export interface SlothUserRating {
  userId: string;
  rating: number;
}

export interface GetAllConditions {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
  cursor?: Prisma.SlothWhereUniqueInput;
  where?: Prisma.SlothWhereInput;
  orderBy?: Prisma.SlothOrderByWithRelationInput;
}

export interface SlothsAll {
  items: Sloth[];
  count: number;
}
