import { Injectable } from '@nestjs/common';
import { UserValidateData } from '../app.interfaces';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(userData: UserValidateData) {
    return this.usersService.validateUser(userData);
  }

  async findUser(id: string) {
    return this.usersService.findOne(id);
  }
}
