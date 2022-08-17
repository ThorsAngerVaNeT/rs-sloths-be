import { randomUUID } from 'crypto';
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

  public getAll(): User[] {
    return this.users;
  }

  getOne(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(createUserDto: CreateUserDto): User {
    const newUser = { ...createUserDto, id: randomUUID() };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: UpdateUserDto): User | undefined {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return undefined;

    this.users[userIndex] = { ...updateUserDto };
    return this.users[userIndex];
  }

  delete(id: string): boolean | undefined {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return undefined;
    this.users.splice(userIndex, 1);
    return true;
  }
}
