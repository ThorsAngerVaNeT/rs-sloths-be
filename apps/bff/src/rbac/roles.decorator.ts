import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../users/entities/user.entity';

export const ROLES_KEY = 'role';
export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
