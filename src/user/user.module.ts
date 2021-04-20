import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname, resolve } from 'path';
import shortid = require('shortid');
import { UserMetaEntity } from '../entities/userMeta.entity';
import { PostEntity } from '../entities/post.entity';
import { PostMetaEntity } from '../entities/postMeta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserMetaEntity, PostEntity, PostMetaEntity]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => cb(null, resolve('.', process.env.USER_IMAGE_PATH)),
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
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
