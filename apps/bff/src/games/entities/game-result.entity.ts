import { User } from '../../users/entities/user.entity';

export class GameResult {
  id: string;

  gameId: string;

  userId: string;

  count: number;

  time: number;

  createdAt: Date;

  user?: User;
}
