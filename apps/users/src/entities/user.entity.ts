export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  role: 'ADMIN' | 'USER';
}

export enum ROLE {
  admin = 'ADMIN',
  user = 'USER',
}
