export class User {
  id: string;

  name: string;

  email: string;

  password: string;

  createdAt: Date;

  role: ROLE;
}

export enum ROLE {
  admin = 'ADMIN',
  user = 'USER',
}
