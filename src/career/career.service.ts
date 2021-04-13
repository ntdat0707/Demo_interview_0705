import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment = require('moment');
import { Connection, getManager, Repository } from 'typeorm';
import { CareerEntity } from '../entities/career.entity';
import { LanguageEntity } from '../entities/language.entity';
import { EResourceStatus } from '../lib/constant';
import { isDuplicateLanguageValid, isLanguageENValid } from '../lib/pipeUtils/languageValidate';
import { convertTv } from '../lib/utils';
import { CreateCareerInput, UpdateCareerInput } from './career.dto';

@Injectable()
export class CareerService {
  private readonly logger = new Logger(CareerService.name);
  constructor(
    @InjectRepository(CareerEntity) private careerRepository: Repository<CareerEntity>,
    @InjectRepository(LanguageEntity) private languageRepository: Repository<LanguageEntity>,
    private connection: Connection,
  ) {}

  async createCareer(careerInput: [CreateCareerInput]) {
    this.logger.debug('create career');
    await Promise.all([
      isLanguageENValid(careerInput, this.languageRepository),
      isDuplicateLanguageValid(careerInput, this.languageRepository),
    ]);
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existCode = await this.careerRepository.findOne({ where: { code: randomCode } });
      if (!existCode) {
        break;
      }
    }
    const newCareers = [];
    for (const item of careerInput) {
      const existTitle = await this.careerRepository.findOne({ where: { title: item.title } });
      if (existTitle) {
        throw new ConflictException('TITLE_EXISTED');
      }
      const career = new CareerEntity();
      career.setAttributes(item);
      career.code = randomCode;
      newCareers.push(career);
    }
    await this.careerRepository.save(newCareers);
    return {};
  }
  async getAllCareer(
    languageId: string,
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    searchValue: string,
    status: string,
    countries?: string[],
  ) {
    this.logger.debug('get-all-career');
    let cacheKey = 'filter_career';
    await this.connection.queryResultCache.clear();
    const careerQuery = this.careerRepository
      .createQueryBuilder('career')
      .where('career."language_id"=:languageId', { languageId })
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('created_at', 'DESC');

    if (countries?.length > 0) {
      const newSearchCountry = [];
      for (let value of countries) {
        value = value.replace(/  +/g, '');
        if (value) {
          newSearchCountry.push(convertTv(value.trim()));
        }
      }
      cacheKey += `searchValue${newSearchCountry}`;
      careerQuery.andWhere(`lower("career"."country") like :value`, {
        value: `%${newSearchCountry}%`,
      });
    }

    if (status) {
      cacheKey += `searchValue${status}`;
      careerQuery.andWhere('"career"."status" = :status', { status });
    }
    if (searchValue) {
      searchValue = convertTv(searchValue.replace(/  +/g, '').trim());
      cacheKey += `searchValue${searchValue}`;
      careerQuery.andWhere(`lower("career"."title") like :value`, {
        value: `%${searchValue}%`,
      });
    }

    let count: any = 0;
    count = await careerQuery.cache(`${cacheKey}_count_page${page}_limit${limit}`).getCount();
    const careers = await careerQuery.cache(`${cacheKey}_page${page}_limit${limit}`).getMany();
    const pages = Math.ceil(Number(count) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: count,
      data: careers,
    };
  }

  async getCareer(code: string, languageId?: string) {
    this.logger.debug('get-career');
    await this.connection.queryResultCache.clear();
    if (!languageId) {
      const career = await this.careerRepository.find({ where: { code: code } });
      return {
        data: career,
      };
    } else {
      const career = await this.careerRepository.findOne({ where: { code: code, languageId: languageId } });
      return {
        data: career,
      };
    }
  }

  async updateCareer(code: string, careerInput: [UpdateCareerInput]) {
    this.logger.debug('update career');
    await isDuplicateLanguageValid(careerInput, this.languageRepository);
    const curCareers: any = await this.careerRepository.find({ where: { code: code } });
    if (curCareers.length === 0) {
      throw new NotFoundException('CAREER_NOT_FOUND');
    }
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      for (const career of careerInput) {
        if (career.id) {
          const index: any = curCareers.findIndex((item: any) => item.id === career.id);
          if (index === -1) {
            throw new NotFoundException(`CAREER_${career.id}_NOT_EXIST `);
          }
          if (curCareers[index].title !== career.title) {
            const existTitle = await this.careerRepository.findOne({
              where: { title: career.title, languageId: career.languageId },
            });
            if (existTitle) {
              throw new ConflictException('TITLE_EXISTED');
            }
          }
          curCareers[index].setAttributes(career);
          if (career.status === EResourceStatus.UNPUBLISH) {
            curCareers[index].closingDate = moment().format('YYYY-MM-DD h:mm');
          }
          await transactionalEntityManager.update<CareerEntity>(CareerEntity, { id: career.id }, curCareers[index]);
        } else {
          const existTitle = await this.careerRepository.findOne({
            where: [{ title: career.title }, { languageId: career.languageId }],
          });
          if (existTitle) {
            throw new ConflictException('TITLE_EXISTED_OR_LANGUAGE_EXISTED');
          }
          const newCar = new CareerEntity();
          newCar.setAttributes(career);
          newCar.code = code;
          if (career.status === EResourceStatus.UNPUBLISH) {
            newCar.closingDate = new Date(moment().format('YYYY-MM-DD h:mm'));
          }
          await transactionalEntityManager.save<CareerEntity>(newCar);
        }
      }
    });
    return {};
  }

  async deleteCareer(code: string) {
    this.logger.debug('delete career');
    const curCareers: any = await this.careerRepository.find({ where: { code: code } });
    if (curCareers.length === 0) {
      throw new NotFoundException('CAREER_NOT_FOUND');
    }
    await this.connection.queryResultCache.clear();
    await this.careerRepository.softDelete(curCareers);
  }
}
