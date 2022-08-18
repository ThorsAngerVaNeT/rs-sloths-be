import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ServiceResponse } from './app.interfaces';
import { CreateSlothDto } from './dto/create-sloth-dto';
import { UpdateSlothDto } from './dto/update-sloth-dto';
import { Sloth } from './entities/sloth.entity';

export class SlothsRepo {
  private sloths: Sloth[];

  constructor() {
    this.sloths = [
      {
        id: 'beb658b5-9178-4ade-ad65-001eddbea009',
        caption: 'bob',
        description: 'Funny',
        image_url: './test.png',
        rating: 4.5,
        createdAt: 1660821235,
      },
      {
        id: 'beb658b5-9178-4ade-ad65-001eddbea009',
        caption: 'john',
        description: 'Angry',
        image_url: './test.png',
        rating: 3.3,
        createdAt: 1658132035,
      },
    ];
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
}
