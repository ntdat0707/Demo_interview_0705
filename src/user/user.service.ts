import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { PostMetaEntity } from '../entities/postMeta.entity';
import { UserEntity } from '../entities/user.entity';
import { UserMetaEntity } from '../entities/userMeta.entity';
import { CreateUserInput, UpdateUserInput } from './user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(UserMetaEntity) private userMetaRepository: Repository<UserMetaEntity>,
    @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
    @InjectRepository(PostMetaEntity) private postMetaRepository: Repository<PostMetaEntity>,
    private connection: Connection,
  ) {}

  async uploadAvatar(image: any) {
    this.logger.debug('upload image banner');
    if (!image) {
      throw new BadRequestException('IMAGE_REQUIRED');
    }
    return {
      data: {
        picture: image.filename,
      },
    };
  }

  async getAllUser(
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    filterValue?: string,
    from?: string,
    to?: string,
  ) {
    this.logger.debug('get all user');
    await this.connection.queryResultCache.clear();
    let cacheKey = 'get_all_user';
    const userQuery = this.userRepository.createQueryBuilder('user');
    const query = userQuery
      .leftJoinAndMapMany(
        'user.userMeta',
        UserMetaEntity,
        'user_meta',
        '"user_meta"."user_id"="user".id and user_meta.deleted_at is null',
      )
      .leftJoinAndMapMany('user.post', PostEntity, 'post', '"post"."user_id"="user".id and post.deleted_at is null')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('"user"."created_at"', 'DESC');
    if (filterValue) {
      cacheKey += `searchValue${filterValue}`;
      query.andWhere(`"user"."status" = :filterValue`, {
        filterValue,
      });
    }
    if (from && to) {
      cacheKey += `from ${from} to ${to}`;
      query.andWhere(`"user"."created_at" BETWEEN :from AND :to`, {
        from,
        to,
      });
    }
    let count: any = 0;
    count = await query.cache(`${cacheKey}_count_page${page}_limit${limit}`).getCount();
    const usersOutput = await query.cache(`${cacheKey}_page${page}_limit${limit}`).getMany();

    const pages = Math.ceil(Number(count) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: count,
      data: usersOutput,
    };
  }

  async getUserById(id: string) {
    this.logger.debug('get user by id');
    await this.connection.queryResultCache.clear();
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('"user"."id" = :id', { id })
      .leftJoinAndMapMany(
        'user.userMeta',
        UserMetaEntity,
        'user_meta',
        '"user_meta"."user_id"="user"."id" and "user"."deleted_at" is null',
      )
      .leftJoinAndMapMany(
        'user.post',
        UserMetaEntity,
        'post',
        '"post"."user_id"="user".id and "post"."deleted_at" is null',
      )
      .getOne();
    return {
      data: user,
    };
  }

  async createUser(userInput: CreateUserInput) {
    this.logger.debug('create user');
    await this.connection.queryResultCache.clear();
    const existedData = await this.userRepository.findOne({
      where: [
        {
          email: userInput.email,
        },
        { userName: userInput.userName },
      ],
    });
    if (existedData) {
      throw new ConflictException('User name or email already exists');
    }
    if (!userInput.userName) {
      let userCode = '';
      while (true) {
        const random =
          Math.random()
            .toString(36)
            .substring(2, 4) +
          Math.random()
            .toString(36)
            .substring(2, 8);
        const randomCode = random.toUpperCase();
        userCode = randomCode;
        const userName = userInput.fullName + userCode;
        const existCode = await this.userRepository.findOne({
          where: {
            userName: userName,
          },
        });
        if (!existCode) {
          Object.assign(userInput, { userName: userName });
          break;
        }
      }
    }
    const newUser = new UserEntity();
    newUser.setAttributes(userInput);
    await this.userRepository.save(newUser);
    return {
      data: newUser,
    };
  }

  async updateUser(id: string, userInput: UpdateUserInput) {
    this.logger.debug('update user');
    await this.connection.queryResultCache.clear();
    const existedUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!existedUser) {
      throw new NotFoundException('User does not exist');
    }
    if (existedUser.email !== userInput.email) {
      throw new NotFoundException('Can not update email');
    }
    existedUser.setAttributes(userInput);
    await this.userRepository.update({ id: id }, existedUser);
    return { data: existedUser };
  }

  async deleteUser(id: string) {
    this.logger.debug('delete user');
    await this.connection.queryResultCache.clear();
    const existedUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!existedUser) {
      throw new NotFoundException('User does not exist');
    }
    const usersMeta = await this.userMetaRepository.find({ where: { userId: existedUser.id } });
    const post = await this.postRepository.find({ where: { userId: existedUser.id } });
    const postMetaList = [];
    for (const item of post) {
      const postsMeta = await this.postMetaRepository.findOne({ where: { postId: item.id } });
      if (postsMeta) {
        postMetaList.push(postsMeta);
      }
    }
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.softRemove<UserEntity>(existedUser);
      await transactionalEntityManager.softRemove<UserMetaEntity[]>(usersMeta);
      if (post.length > 0) {
        await transactionalEntityManager.softRemove<PostEntity[]>(post);
      }
      if (postMetaList.length > 0) {
        await transactionalEntityManager.softRemove<PostMetaEntity[]>(postMetaList);
      }
    });
    return {};
  }
}
