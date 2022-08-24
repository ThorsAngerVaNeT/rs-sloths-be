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

export interface UserValidateData {
  name: string;
  github: string | undefined;
}
