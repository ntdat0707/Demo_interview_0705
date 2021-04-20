import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserMetaEntity } from '../entities/userMeta.entity';
import { UserMetaInput } from './user-meta.dto';

@Injectable()
export class UserMetaService {
  private readonly logger = new Logger(UserMetaService.name);
  constructor(
    @InjectRepository(UserMetaEntity) private userMetaRepository: Repository<UserMetaEntity>,
    private connection: Connection,
  ) {}
  async creatUserMeta(userMetaInput: UserMetaInput) {
    this.logger.debug('create user meta');
    await this.connection.queryResultCache.clear();
    const newUserMeta = new UserMetaEntity();
    newUserMeta.setAttributes(userMetaInput);
    await this.userMetaRepository.save(newUserMeta);
    return {
      data: newUserMeta,
    };
  }
}
