import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryInput } from './category.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}
  async createCategory(categoryInput: CategoryInput) {
    this.logger.debug('Create category');
    const newCategory = new CategoryEntity();
    newCategory.setAttributes(categoryInput);
    await this.categoryRepository.save(newCategory);
    return {
      data: newCategory,
    };
  }
}
