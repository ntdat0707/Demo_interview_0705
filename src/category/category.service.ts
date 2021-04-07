import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { LanguageEntity } from '../entities/language.entity';
import { isThreeLanguageValid } from '../lib/pipeUtils/languageValidate';
import { CreateCategoryInput, UpdateCategoryInput } from './category.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
    private connection: Connection,
  ) {}

  async createCategory(categoriesInput: [CreateCategoryInput], status: string) {
    this.logger.debug('Create category');
    await isThreeLanguageValid(categoriesInput, this.languageRepository);
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existCode = await this.categoryRepository.findOne({ where: { code: randomCode } });
      if (!existCode) {
        break;
      }
    }
    const newCategories = [];
    for (const item of categoriesInput) {
      const cateExisted = await this.categoryRepository.findOne({
        where: [
          { languageId: item.languageId, title: item.title, type: item.type },
          { languageId: item.languageId, link: item.link, type: item.type },
        ],
      });
      if (cateExisted) {
        throw new ConflictException('TITLE_OR_LINK_ALREADY_EXISTED');
      }
      const newCategory = new CategoryEntity();
      newCategory.setAttributes(item);
      newCategory.code = randomCode;
      newCategory.status = status;
      newCategories.push(newCategory);
    }
    await this.categoryRepository.save(newCategories);
    return {};
  }

  async getAllCategory(
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    type: string,
    languageId: string,
  ) {
    this.logger.debug('get all category');
    await this.connection.queryResultCache.clear();
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category."deleted_at" is null AND category."type"=:type', {
        type,
      });
    if (languageId) {
      const language = await this.languageRepository.findOne({ where: { id: languageId } });
      if (!language) {
        throw new NotFoundException('LANGUAGE_NOT_FOUND');
      }
      query.andWhere('category."language_id" =:languageId', { languageId });
    }
    const cateCount = await query.cache(`category_count_page${page}_limit${limit}`).getCount();
    const categories: any = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('category."created_at"', 'DESC')
      .cache(`categories_page${page}_limit${limit}`)
      .getMany();
    const pages = Math.ceil(Number(cateCount) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: cateCount,
      data: categories,
    };
  }

  async getCategory(code: string, languageId?: string) {
    this.logger.debug('get category by coded');
    await this.connection.queryResultCache.clear();
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category."deleted_at" is null AND category."code" =:code', { code })
      .orderBy('category."created_at"', 'DESC');
    if (languageId) {
      const language = await this.languageRepository.findOne({ where: { id: languageId } });
      if (!language) {
        throw new NotFoundException('LANGUAGE_NOT_FOUND');
      }
      query.andWhere('category."language_id" =:languageId', { languageId });
    }
    const categories = await query.getMany();
    return {
      data: categories,
    };
  }

  async updateCategory(code: string, categoriesInput: [UpdateCategoryInput], status?: string) {
    this.logger.debug('Update category');
    await isThreeLanguageValid(categoriesInput, this.languageRepository);
    const currCategories = await this.categoryRepository.find({ where: { code: code } });
    if (currCategories.length === 0) {
      throw new NotFoundException('CODE_NOT_FOUND');
    }
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      for (const item of categoriesInput) {
        if (item.id) {
          const index = currCategories.findIndex((x: any) => x.id === item.id);
          if (index < 0) {
            throw new NotFoundException('CATEGORY_NOT_FOUND');
          }
          currCategories[index].setAttributes(item);
          if (status) {
            currCategories[index].status = status;
          }
          await transactionalEntityManager.update(CategoryEntity, { id: item.id }, currCategories[index]);
        } else {
          const cateExisted = await this.categoryRepository.findOne({
            where: { code: code, languageId: item.languageId },
          });
          if (cateExisted) {
            throw new ConflictException(`THIS_CATEGORY_${item.languageId}_EXISTED`);
          }
          const newCategory = new CategoryEntity();
          newCategory.setAttributes(item);
          newCategory.code = code;
          if (status) {
            newCategory.status = status;
          }
          await transactionalEntityManager.save(CategoryEntity, newCategory);
        }
      }
    });
  }

  async deleteCategory(code: string) {
    this.logger.debug('Delete category');
    const delCate = await this.categoryRepository.find({ where: { code: code } });
    if (delCate.length === 0) {
      throw new NotFoundException('CATEGORY_NOT_FOUND');
    }
    await this.connection.queryResultCache.clear();
    await this.categoryRepository.softDelete({ code: code });
  }
}
