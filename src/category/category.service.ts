import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { LanguageEntity } from '../entities/language.entity';
import { checkStatusCategory } from '../lib/pipeUtils/categoryValidate';
import { isDuplicateLanguageValid, isLanguageENValid } from '../lib/pipeUtils/languageValidate';
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

  async createCategory(categoriesInput: [CreateCategoryInput]) {
    this.logger.debug('Create category');
    await checkStatusCategory(categoriesInput);
    await isLanguageENValid(categoriesInput, this.languageRepository);
    await isDuplicateLanguageValid(categoriesInput, this.languageRepository);
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
          { languageId: item.languageId, title: item.title },
          { languageId: item.languageId, link: item.link },
        ],
      });
      if (cateExisted) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'TITLE_OR_LINK_ALREADY_EXISTED',
          },
          HttpStatus.CONFLICT,
        );
      }
      const newCategory = new CategoryEntity();
      newCategory.setAttributes(item);
      newCategory.code = randomCode;
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
      .where('category."deleted_at" is null AND category."language_id" =:languageId AND category."type"=:type', {
        languageId,
        type,
      });
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

  async getCategory(code: string) {
    this.logger.debug('get category by coded');
    await this.connection.queryResultCache.clear();
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category."deleted_at" is null AND category."code" =:code', { code });
    const categories: any = await query.orderBy('category."created_at"', 'DESC').getMany();
    return {
      data: categories,
    };
  }

  async updateCategory(code: string, categoriesInput: [UpdateCategoryInput]) {
    this.logger.debug('Update category');
    await checkStatusCategory(categoriesInput);
    await isDuplicateLanguageValid(categoriesInput, this.languageRepository);
    const currCategories = await this.categoryRepository.find({ where: { code: code } });
    if (currCategories.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `CODE_${code}_NOT_FOUND`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      for (const item of categoriesInput) {
        if (item.id) {
          const index = currCategories.findIndex((x: any) => x.id === item.id);
          if (index < 0) {
            throw new HttpException(
              {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'CATEGORY_NOT_EXISTED',
              },
              HttpStatus.NOT_FOUND,
            );
          }
          currCategories[index].setAttributes(item);
          await transactionalEntityManager.update(CategoryEntity, { id: item.id }, currCategories[index]);
        } else {
          const cateExisted = await this.categoryRepository.findOne({
            where: { code: item.code, languageId: item.languageId },
          });
          if (cateExisted) {
            throw new HttpException(
              {
                statusCode: HttpStatus.NOT_FOUND,
                message: `THIS_CATEGORY_${item.languageId}_EXISTED`,
              },
              HttpStatus.NOT_FOUND,
            );
          }
          const newCategory = new CategoryEntity();
          newCategory.setAttributes(item);
          newCategory.code = item.code;
          await transactionalEntityManager.save(CategoryEntity, newCategory);
        }
      }
    });
  }

  async deleteCategory(code: string) {
    this.logger.debug('Delete category');
    const delCate = await this.categoryRepository.find({ where: { code: code } });
    if (delCate.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'CATEGORY_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await this.categoryRepository.softDelete({ code: code });
  }
}
