import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMetaEntity } from '../entities/userMeta.entity';
import { UserMetaController } from './user-meta.controller';
import { UserMetaService } from './user-meta.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserMetaEntity])],
  controllers: [UserMetaController],
  providers: [UserMetaService],
})
export class UserMetaModule {}
