export interface User {
  id: string;
  name: string;
  github: string;
  avatar_url: string;
  createdAt: Date;
  role: ROLE;
}

export enum ROLE {
  admin = 'ADMIN',
  user = 'USER',
}
