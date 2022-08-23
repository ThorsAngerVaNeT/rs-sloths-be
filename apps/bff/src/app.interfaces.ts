import { User } from './users/entities/user.entity';

export interface ServiceResponse<T> {
  status: number;
  error?: string;
  data?: T;
}

export interface UsersAll {
  items: User[];
  count: number;
}
