import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserInput } from './user.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity) private postRepository: Repository<PostEntity>,
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

  async updateUser(userId: string, userInput: UpdateUserInput) {
    this.logger.debug('update user');
    await this.connection.queryResultCache.clear();
    const existedUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!existedUser) {
      throw new NotFoundException('User does not exist');
    }
    Object.assign(userInput, { code: existedUser.code });
    existedUser.setAttributes(userInput);
    if (userInput.password) {
      existedUser.password = bcrypt.hashSync(userInput.password, 10);
    }
    await this.userRepository.update({ id: userId }, existedUser);
    return { data: existedUser };
  }

  async deleteUser(userId: string) {
    this.logger.debug('delete user');
    await this.connection.queryResultCache.clear();
    const existedUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!existedUser) {
      throw new NotFoundException('User does not exist');
    }
    const post = await this.postRepository.find({ where: { userId: existedUser.id } });
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.softRemove<UserEntity>(existedUser);
      if (post.length > 0) {
        await transactionalEntityManager.softRemove<PostEntity[]>(post);
      }
    });
    return {};
  }
}
