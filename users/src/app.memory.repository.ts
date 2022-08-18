import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ServiceResponse } from './app.interfaces';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './entities/user.entity';

export class UsersRepo {
  private users: User[];

  constructor() {
    this.users = [
      { id: '1', name: 'bob', email: 'bob@gmail.com' },
      { id: '2', name: 'john', email: 'john@gmail.com' },
    ];
  }

  public getAll(page: number, limit: number): ServiceResponse<User[]> {
    if (page > 0 && limit > 0) {
      const start = (page - 1) * limit;
      const end = start + limit;

      return { data: this.users.slice(start, end), status: HttpStatus.OK };
    }
    return { data: this.users, status: HttpStatus.OK };
  }

  getOne(id: string): ServiceResponse<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return { error: `User "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    return { data: user, status: HttpStatus.OK };
  }

  create(createUserDto: CreateUserDto): ServiceResponse<User> {
    const newUser = { ...createUserDto, id: randomUUID() };
    this.users.push(newUser);

    return { data: newUser, status: HttpStatus.CREATED };
  }

  update(id: string, updateUserDto: UpdateUserDto): ServiceResponse<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return { error: `User "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    this.users[userIndex] = { ...updateUserDto };

    return { data: this.users[userIndex], status: HttpStatus.OK };
  }

  delete(id: string): ServiceResponse<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return { error: `User "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    this.users.splice(userIndex, 1);

    return { status: HttpStatus.NO_CONTENT };
  }
}
