import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { PostMetaEntity } from '../entities/postMeta.entity';
import { CreatePostMetaInput } from './post-meta.dto';

@Injectable()
export class PostMetaService {
  private readonly logger = new Logger(PostMetaService.name);
  constructor(
    @InjectRepository(PostMetaEntity) private postMetaRepository: Repository<PostMetaEntity>,
    private connection: Connection,
  ) {}
  async createPostMeta(postMetaInput: CreatePostMetaInput) {
    this.logger.debug('create post meta');
    await this.connection.queryResultCache.clear();
    const newPostMeta = new PostMetaEntity();
    newPostMeta.setAttributes(postMetaInput);
    await this.postMetaRepository.save(newPostMeta);
    return {
      data: newPostMeta,
    };
  }
}
