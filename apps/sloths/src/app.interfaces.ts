export interface ServiceResponse<T> {
  status: number;
  error?: string;
  data?: T | undefined;
}

export interface SlothUserRating {
  userId: string;
  rating: number;
}
