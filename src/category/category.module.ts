import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { LanguageEntity } from '../entities/language.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, LanguageEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
