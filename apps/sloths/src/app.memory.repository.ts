import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ServiceResponse, SlothUserRating } from './app.interfaces';
import { CreateSlothDto } from './dto/create-sloth.dto';
import { UpdateSlothRatingDto } from './dto/update-sloth-rating.dto';
import { UpdateSlothDto } from './dto/update-sloth.dto';
import { Sloth } from './entities/sloth.entity';

export class SlothsRepo {
  private sloths: Sloth[];

  private rating: { [keyof: string]: SlothUserRating[] };

  constructor() {
    this.sloths = [
      {
        id: 'beb658b5-9178-4ade-ad65-001eddbea009',
        caption: 'bob',
        description: 'Funny',
        image_url: './test.png',
        rating: 4,
        createdAt: 1660821235,
      },
      {
        id: 'e6242aa4-c297-4edd-9f93-9909e72df5f5',
        caption: 'john',
        description: 'Angry',
        image_url: './test.png',
        rating: 3.5,
        createdAt: 1658132035,
      },
    ];

    this.rating = {
      'beb658b5-9178-4ade-ad65-001eddbea009': [{ userId: '3b36a8be-24e6-4577-84b7-a10306ce5438', rating: 4 }],
      'e6242aa4-c297-4edd-9f93-9909e72df5f5': [
        { userId: 'cf44f746-e8c3-457e-993d-9b4c029d2d28', rating: 4 },
        { userId: 'abf3d697-68d9-40c9-8647-42c5c01aa8b9', rating: 3 },
      ],
    };
  }

  public getAll(page: number, limit: number): ServiceResponse<Sloth[]> {
    if (page > 0 && limit > 0) {
      const start = (page - 1) * limit;
      const end = start + limit;

      return { data: this.sloths.slice(start, end), status: HttpStatus.OK };
    }
    return { data: this.sloths, status: HttpStatus.OK };
  }

  getOne(id: string): ServiceResponse<Sloth> {
    const sloth = this.sloths.find((u) => u.id === id);
    if (!sloth) {
      return { error: `Sloth "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    return { data: sloth, status: HttpStatus.OK };
  }

  create(createSlothDto: CreateSlothDto): ServiceResponse<Sloth> {
    const newSloth = { ...createSlothDto, id: randomUUID(), createdAt: Date.now(), rating: 0, image_url: './test.png' };
    this.sloths.push(newSloth);

    return { data: newSloth, status: HttpStatus.CREATED };
  }

  update(id: string, updateSlothDto: UpdateSlothDto): ServiceResponse<Sloth> {
    const slothIndex = this.sloths.findIndex((sloth) => sloth.id === id);
    if (slothIndex === -1) {
      return { error: `Sloth "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    this.sloths[slothIndex] = { ...this.sloths[slothIndex], ...updateSlothDto };

    return { data: this.sloths[slothIndex], status: HttpStatus.OK };
  }

  delete(id: string): ServiceResponse<Sloth> {
    const slothIndex = this.sloths.findIndex((sloth) => sloth.id === id);
    if (slothIndex === -1) {
      return { error: `Sloth "${id}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    this.sloths.splice(slothIndex, 1);

    return { status: HttpStatus.NO_CONTENT };
  }

  updateRating({ slothId, userId, rate }: UpdateSlothRatingDto): ServiceResponse<Pick<Sloth, 'id' | 'rating'>> {
    const slothResult = this.getOne(slothId);
    if (slothResult.error || !slothResult.data) {
      return { error: `Sloth "${slothId}" not found!`, status: HttpStatus.NOT_FOUND };
    }

    const sloth = slothResult.data;
    const isSlothRatingExist = Object.keys(this.rating).includes(slothId);
    if (!isSlothRatingExist) {
      this.rating[slothId]?.push({ userId, rating: rate });
      if (sloth) {
        sloth.rating = rate;
      }
      return { data: { id: slothId, rating: rate }, status: HttpStatus.OK };
    }

    const slothUserRating = this.rating[slothId].find((rating) => rating.userId === userId);
    if (slothUserRating) {
      slothUserRating.rating = rate;
    } else {
      this.rating[slothId]?.push({ userId, rating: rate });
    }

    const calculatedRating = +(
      this.rating[slothId].reduce((acc, cur) => acc + cur.rating, 0) / this.rating[slothId].length
    ).toFixed(2);
    sloth.rating = calculatedRating;

    return { data: { id: slothId, rating: calculatedRating }, status: HttpStatus.OK };
  }
}
