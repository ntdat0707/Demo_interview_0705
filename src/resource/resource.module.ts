import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { basename, extname, resolve } from 'path';
import { ResourceEntity } from '../entities/resource.entity';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import * as shortid from 'shortid';
import { ResourceAuthorEntity } from '../entities/resourceAuthor.entity';
import { ResourceCateEntity } from '../entities/resourceCate.entity';
import { ResourceImageEntity } from '../entities/resourceImage.entity';
import { ResourceLabelEntity } from '../entities/resourceLabel.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResourceEntity,
      ResourceAuthorEntity,
      ResourceCateEntity,
      ResourceImageEntity,
      ResourceLabelEntity,
    ]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => cb(null, resolve('.', process.env.RESOURCE_IMAGE_PATH)),
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
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
