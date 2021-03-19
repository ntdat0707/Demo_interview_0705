import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerEntity } from '../entities/career.entity';
import { LanguageEntity } from '../entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CareerEntity, LanguageEntity])],
  providers: [CareerService],
  controllers: [CareerController],
})
export class CareerModule {}
