export class Suggestion {
  id: string;

  description: string;

  image_url: string;

  userId: string;

  rating: number;

  createdAt: Date;

  status: SuggestionStatus;
}

export enum SuggestionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINE = 'DECLINE',
}
