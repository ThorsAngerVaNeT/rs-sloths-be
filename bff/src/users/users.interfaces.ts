export interface ServiceResponse<T> {
  status: number;
  error?: string;
  data?: T;
}
