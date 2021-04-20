import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMetaEntity } from '../entities/postMeta.entity';
import { PostMetaController } from './post-meta.controller';
import { PostMetaService } from './post-meta.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostMetaEntity])],
  controllers: [PostMetaController],
  providers: [PostMetaService],
})
export class PostMetaModule {}
