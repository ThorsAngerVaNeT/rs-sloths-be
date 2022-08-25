import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GetAllConditions, ServiceResponse, UsersAll } from './app.interfaces';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ValidateUserDto } from './dto/validate-user.dto';
import { ROLE, User } from './entities/user.entity';

export class UsersRepo {
  private users: User[];

  constructor() {
    this.users = [
      {
        id: 'b17fa9eb-5384-4645-8004-3de3a22a8a51',
        name: 'bob',
        github: 'test',
        avatar_url: 'https://avatars.githubusercontent.com/u/101447709?v=4',
        createdAt: new Date(1660248195177),
        role: ROLE.admin,
      },
      {
        id: 'ba550bcd-4255-4c54-86f9-7e2db3786806',
        name: 'john',
        github: 'test',
        avatar_url: 'https://avatars.githubusercontent.com/u/101447709?v=4',
        createdAt: new Date(1661248196177),
        role: ROLE.user,
      },
    ];
  }

  public async getAll({ page, limit }: GetAllConditions): Promise<ServiceResponse<UsersAll>> {
    if (page && limit && page > 0 && limit > 0) {
      const start = (page - 1) * limit;
      const end = start + limit;
      const items = this.users.slice(start, end);

      return { data: { count: items.length, items }, status: HttpStatus.OK };
    }
    return { data: { items: this.users, count: this.users.length }, status: HttpStatus.OK };
  }

  public async getOne({ id }: { id: string }): Promise<ServiceResponse<User>> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return { error: `User "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    return { data: user, status: HttpStatus.OK };
  }

  public async create(createUserDto: CreateUserDto): Promise<ServiceResponse<User>> {
    const newUser = {
      ...createUserDto,
      id: randomUUID(),
      createdAt: new Date(),
      role: ROLE.user,
      avatar_url: 'https://avatars.githubusercontent.com/u/101447709?v=4',
    };
    this.users.push(newUser);

    return { data: newUser, status: HttpStatus.CREATED };
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<ServiceResponse<User>> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return { error: `User "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };

    return { data: this.users[userIndex], status: HttpStatus.OK };
  }

  public async delete(id: string): Promise<ServiceResponse<User>> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return { error: `User "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    this.users.splice(userIndex, 1);

    return { status: HttpStatus.NO_CONTENT };
  }

  async validate(userData: ValidateUserDto): Promise<ServiceResponse<User>> {
    const data = this.users.find((u) => u.github === userData.github);
    if (data) {
      return { data, status: HttpStatus.OK };
    }

    return this.create(userData);
  }
}
