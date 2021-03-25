import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { basename, extname, resolve } from 'path';
import shortid = require('shortid');
import { LanguageEntity } from '../entities/language.entity';
import { SolutionEntity } from '../entities/solution.entity';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolutionEntity, LanguageEntity]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => cb(null, resolve('.', process.env.SOLUTION_IMAGE_PATH)),
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
  controllers: [SolutionController],
  providers: [SolutionService],
})
export class SolutionModule {}
