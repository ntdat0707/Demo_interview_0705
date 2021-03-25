import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { LanguageEntity } from '../entities/language.entity';
import { isDuplicateLanguageValid, isLanguageENValid } from '../lib/pipeUtils/languageValidate';
import { CategoryInput } from './category.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
  ) {}

  async createCategory(categoriesInput: [CategoryInput]) {
    this.logger.debug('Create category');
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
    //await getManager().transaction(async transactionalEntityManager => {
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
    languageId: string,
  ) {
    this.logger.debug('get all category');
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('category."deleted_at" is null AND category."language_id" =:languageId', { languageId });
    const cateCount = await query.cache(`category_count_page${page}_limit${limit}`).getCount();
    const categories: any = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('category."created_at"', 'DESC')
      .cache(`categories_page${page}_limit${limit}`)
      .getMany();
    const pages = Math.ceil(Number(cateCount) / limit);
    //const categories = await this.categoryRepository.find({});
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: cateCount,
      data: categories,
    };
  }
}
