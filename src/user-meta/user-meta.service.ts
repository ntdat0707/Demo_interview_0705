import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserMetaEntity } from '../entities/userMeta.entity';
import { UserMetaInput } from './user-meta.dto';

@Injectable()
export class UserMetaService {
  private readonly logger = new Logger(UserMetaService.name);
  constructor(
    @InjectRepository(UserMetaEntity) private userMetaRepository: Repository<UserMetaEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private connection: Connection,
  ) {}
  async creatUserMeta(userMetaInput: UserMetaInput) {
    this.logger.debug('create user meta');
    await this.connection.queryResultCache.clear();
    const user = await this.userRepository.findOne({ where: { id: userMetaInput.userId } });
    if (!user) {
      throw new NotFoundException(`User ${userMetaInput.userId} not found`);
    }
    const newUserMeta = new UserMetaEntity();
    newUserMeta.setAttributes(userMetaInput);
    await this.userMetaRepository.save(newUserMeta);
    return {
      data: newUserMeta,
    };
  }
}
