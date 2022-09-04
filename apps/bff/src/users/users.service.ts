import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetAll, GetAllConditions, ServiceResponse } from '../app.interfaces';
import { MS_IN_ONE_DAY } from '../common/constants';
import { SlothsService } from '../sloths/sloths.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TodayUserSloth } from './entities/today-user-sloth.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS')
    private readonly client: ClientProxy,
    private readonly slothsService: SlothsService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'create_user' }, createUserDto));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  async findAll(conditions: GetAllConditions): Promise<GetAll<User> | undefined> {
    const users = await firstValueFrom(
      this.client.send<ServiceResponse<GetAll<User>>>({ cmd: 'get_users' }, conditions)
    );
    return users.data;
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'get_user' }, id));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | undefined> {
    const user = await firstValueFrom(
      this.client.send<ServiceResponse<User>>({ cmd: 'update_user' }, { ...updateUserDto, id })
    );
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  async remove(id: string) {
    const user = await firstValueFrom(this.client.send<ServiceResponse<User>>({ cmd: 'delete_user' }, id));
    if (user.error) {
      throw new HttpException(user.error, user.status);
    }

    return user.data;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto) {
    const profile = await firstValueFrom(
      this.client.send<ServiceResponse<User>>({ cmd: 'update_profile' }, updateProfileDto)
    );
    if (profile.error) {
      throw new HttpException(profile.error, profile.status);
    }

    return profile.data;
  }

  async findTodaySloth(user: User) {
    const todaySloth = await firstValueFrom(
      this.client.send<ServiceResponse<TodayUserSloth>>({ cmd: 'get_today_sloth' }, user.id)
    );

    if (todaySloth.error && todaySloth.status !== HttpStatus.NOT_FOUND) {
      throw new HttpException(todaySloth.error, todaySloth.status);
    }

    const isRandomSlothNeeded =
      todaySloth.status === HttpStatus.NOT_FOUND ||
      Date.now() - +new Date(todaySloth.data?.updatedAt ?? 0) >= MS_IN_ONE_DAY;

    if (!isRandomSlothNeeded && todaySloth.data?.slothId) {
      return this.slothsService.findOne(todaySloth.data?.slothId);
    }

    const sloth = await this.slothsService.findRandom();

    if (!sloth) throw new NotFoundException();

    const todaySlothUpdate = await firstValueFrom(
      this.client.send<ServiceResponse<TodayUserSloth>>(
        { cmd: 'update_today_sloth' },
        { userId: user.id, slothId: sloth.id }
      )
    );
    if (todaySlothUpdate.error) {
      throw new HttpException(todaySlothUpdate.error, todaySlothUpdate.status);
    }

    return sloth;
  }
}
