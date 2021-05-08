import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from '../entities/user.entity';
import { convertTv } from '../lib/utils';
import { CreatePostInput, UpdatePostInput } from './post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private connection: Connection,
  ) {}

  async getAllPost(
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    searchValue?: string,
  ) {
    this.logger.debug('get all user');
    await this.connection.queryResultCache.clear();
    let cacheKey = 'get_all_post';
    const postQuery = this.postRepository.createQueryBuilder('post');
    const query = postQuery
      .leftJoinAndMapOne('post.user', UserEntity, 'user', '"post"."user_id"="user".id and post.deleted_at is null')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('"post"."created_at"', 'DESC');
    //search value
    if (searchValue) {
      searchValue = convertTv(searchValue.replace(/  +/g, '').trim());
      cacheKey += `searchValue${searchValue}`;
      query.andWhere(`lower("post"."title") like :value OR lower("post"."content") like :value `, {
        value: `%${searchValue}%`,
      });
    }

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
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where(`"post"."id" = :id`, { id })
      .leftJoinAndMapOne('post.user', UserEntity, 'user', '"post"."user_id"="user".id and post.deleted_at is null')
      .getOne();
    return {
      data: post,
    };
  }

  async createPost(userId: string, postInput: CreatePostInput) {
    this.logger.debug('create post');
    await this.connection.queryResultCache.clear();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    const existedPost = await this.postRepository.findOne({
      where: {
        title: postInput.title,
      },
    });
    if (existedPost) {
      throw new ConflictException('Post already exists');
    }

    const newPost = new PostEntity();
    newPost.userId = userId;
    newPost.setAttributes(postInput);
    await this.postRepository.save(newPost);
    return {
      data: newPost,
    };
  }

  async updatePost(userId: string, id: string, postInput: UpdatePostInput) {
    this.logger.debug('update post');
    await this.connection.queryResultCache.clear();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist`);
    }
    const existedPost = await this.postRepository.findOne({
      where: { id: id, userId: userId },
    });
    if (!existedPost) {
      throw new NotFoundException('Post does not exist');
    }
    existedPost.setAttributes(postInput);
    await this.postRepository.update({ id: id }, existedPost);
    return { data: existedPost };
  }

  async getPostByUser(userId: string) {
    this.logger.debug('get post by user');
    await this.connection.queryResultCache.clear();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist`);
    }
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('"post"."user_id" = :userId', { userId })
      .leftJoinAndMapOne('post.user', UserEntity, 'user', '"post"."user_id"="user".id and post.deleted_at is null')
      .getMany();
    return {
      data: posts,
    };
  }

  async deletePost(userId: string, id: string) {
    this.logger.debug('delete post');
    await this.connection.queryResultCache.clear();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist`);
    }
    const existedPost = await this.postRepository.findOne({
      where: { id: id },
    });
    if (!existedPost) {
      throw new NotFoundException('Post does not exist');
    }
    if (existedPost.userId !== userId) {
      throw new NotFoundException('Your permission can not delete this post');
    }
    await this.postRepository.softRemove(existedPost);
    return {};
  }
}
