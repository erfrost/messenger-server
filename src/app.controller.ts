import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { AppService } from './app.service';

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      const uniqueFilename = `${uuidv4()}-${slugify(file.originalname)}`;
      cb(null, uniqueFilename);
    },
  }),
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.appService.createImage(file);
  }
}
