import { IsUUID } from 'class-validator';

export class TodayUserSloth {
  @IsUUID(4)
  id: string;

  userId: string;

  slothId: string;

  updatedAt: Date;
}
