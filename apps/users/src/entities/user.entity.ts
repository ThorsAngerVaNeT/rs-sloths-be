export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
  role: ROLE;
}

export enum ROLE {
  admin = 'ADMIN',
  user = 'USER',
}
