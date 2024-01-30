import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from './entities/images.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  ) {}

  async createImage(image: Express.Multer.File) {
    const model = this.imagesRepository.create({
      path: process.env.IMAGES_PATH + image.filename,
    });

    const newImage = await this.imagesRepository.save(model);
    return newImage;
  }
}
