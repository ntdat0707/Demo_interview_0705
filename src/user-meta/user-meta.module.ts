import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserMetaEntity } from '../entities/userMeta.entity';
import { UserMetaController } from './user-meta.controller';
import { UserMetaService } from './user-meta.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserMetaEntity, UserEntity])],
  controllers: [UserMetaController],
  providers: [UserMetaService],
})
export class UserMetaModule {}
