import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { PostMetaEntity } from '../entities/postMeta.entity';
import { UserEntity } from '../entities/user.entity';
import { CreatePostInput, UpdatePostInput } from './post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private connection: Connection,
  ) {}

  async getAllPost(page = 1, limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10)) {
    this.logger.debug('get all user');
    await this.connection.queryResultCache.clear();
    const cacheKey = 'get_all_post';
    const postQuery = this.postRepository.createQueryBuilder('post');
    const query = postQuery
      .leftJoinAndMapMany(
        'post.postMeta',
        PostMetaEntity,
        'post_meta',
        '"post_meta"."post_id"="post".id and post_meta.deleted_at is null',
      )
      .leftJoinAndMapOne('post.user', UserEntity, 'user', '"post"."user_id"="user".id and post.deleted_at is null')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('user."created_at"', 'DESC');

    let count: any = 0;
    count = await query.cache(`${cacheKey}_count_page${page}_limit${limit}`).getCount();
    const postsOutput = await query.cache(`${cacheKey}_page${page}_limit${limit}`).getMany();

    const pages = Math.ceil(Number(count) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: count,
      data: postsOutput,
    };
  }

  async getPostById(id: string) {
    this.logger.debug('get post by id');
    await this.connection.queryResultCache.clear();
    const post = this.postRepository
      .createQueryBuilder('post')
      .where('"post".id=:id', { id })
      .leftJoinAndMapMany(
        'post.postMeta',
        PostMetaEntity,
        'post_meta',
        '"post_meta"."post_id"="post".id and post_meta.deleted_at is null',
      )
      .leftJoinAndMapOne('post.user', UserEntity, 'user', '"post"."user_id"="user".id and post.deleted_at is null')
      .getOne();
    return {
      data: post,
    };
  }

  async createPost(postInput: CreatePostInput) {
    this.logger.debug('create post');
    await this.connection.queryResultCache.clear();
    const existedPost = await this.postRepository.findOne({
      where: {
        title: postInput.title,
      },
    });
    if (existedPost) {
      throw new ConflictException('Post already exists');
    }
    const user = await this.userRepository.findOne({ where: { id: postInput.userId } });
    if (!user) {
      throw new NotFoundException(`User ${postInput.userId} not found`);
    }
    const newPost = new PostEntity();
    newPost.setAttributes(postInput);
    await this.postRepository.save(newPost);
    return {
      data: newPost,
    };
  }

  async updatePost(id: string, postInput: UpdatePostInput) {
    this.logger.debug('update post');
    await this.connection.queryResultCache.clear();
    const existedPost = await this.postRepository.findOne({
      where: { id: id },
    });
    if (!existedPost) {
      throw new NotFoundException('Post does not exist');
    }
    existedPost.setAttributes(postInput);
    await this.postRepository.update({ id: id }, existedPost);
    return { data: existedPost };
  }
}
