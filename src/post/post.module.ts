import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { PostMetaEntity } from '../entities/postMeta.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostMetaEntity, UserEntity])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
