import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerEntity } from '../entities/career.entity';
import { LanguageEntity } from '../entities/language.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname, resolve } from 'path';
import shortid = require('shortid');

@Module({
  imports: [
    TypeOrmModule.forFeature([CareerEntity, LanguageEntity]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => cb(null, resolve('.', process.env.UPLOAD_CAREER_IMAGE_PATH)),
          filename: (req: any, file: any, cb: any) => {
            cb(
              null,
              `${basename(file.originalname, extname(file.originalname).toLowerCase())}_${shortid.generate()}${extname(
                file.originalname,
              ).toLowerCase()}`,
            );
          },
        }),
      }),
    }),
  ],
  providers: [CareerService],
  controllers: [CareerController],
})
export class CareerModule {}
