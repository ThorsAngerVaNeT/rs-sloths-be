export class User {
  id: string;

  name: string;

  github: string;

  image_url: string;

  createdAt: Date;

  role: ROLE;
}

export enum ROLE {
  admin = 'ADMIN',
  user = 'USER',
}
