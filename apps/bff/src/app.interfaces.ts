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
