import { User } from './users/entities/user.entity';

export interface ServiceResponse<T> {
  status: number;
  error?: string;
  data?: T;
}

export interface GetAll<T> {
  items: T[];
  count: number;
}

export interface UserValidateData {
  avatar_url: string | undefined;
  name: string;
  github: string | undefined;
}

export type RequestWithUser = Request & { user: User };

export interface GetAllConditions {
  page?: number;
  limit?: number;
  where?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  userId?: string;
  gameId?: string;
  select?: Record<string, unknown>;
}

export type WhereFieldName =
  | 'name'
  | 'github'
  | 'caption'
  | 'description'
  | 'tags'
  | 'value'
  | 'userId'
  | 'gameId'
  | 'role'
  | 'id'
  | 'status';

type WhereFieldContains = {
  [keyof in WhereFieldName]?: { contains: string; mode: string };
};

export type WhereFieldEquals = {
  [keyof in WhereFieldName]?: string;
};

export type WhereField = WhereFieldContains | WhereFieldEquals;

export type WhereFieldFilter = { OR: WhereField[] };

export interface GetWhereInput {
  searchText?: string;
  searchFields?: WhereFieldName[];
  filterValues?: string[];
  filterFields?: WhereFieldName[] | [WhereFieldName, WhereFieldName][];
}

export type OrderBy = { [keyof: string]: string };

export enum OrderDirections {
  asc = 'asc',
  desc = 'desc',
}
