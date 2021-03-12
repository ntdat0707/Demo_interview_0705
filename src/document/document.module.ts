import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { basename, extname, resolve } from 'path';
import shortid = require('shortid');
import { DocumentEntity } from '../entities/document.entity';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => cb(null, resolve('.', process.env.UPLOAD_DOCUMENT_PATH)),
          filename: (req: any, file: any, cb: any) => {
            cb(
              null,
              `${basename(file.originalname, extname(file.originalname).toLowerCase())}_${shortid.generate()}${extname(
                file.originalname,
              ).toLowerCase()}`,
            );
          },
        }),
        limits: {
          fileSize: parseInt(process.env.MAX_SIZE_PER_FILE_UPLOAD, 10),
          files: parseInt(process.env.MAX_NUMBER_FILE_UPLOAD, 10),
        },
      }),
    }),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
