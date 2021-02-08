import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Connection, Repository } from 'typeorm';
import { CareerEntity } from '../entities/career.entity';
import { convertTv } from '../lib/utils';
import { CreateCareerInput, UpdateCareerInput } from './career.dto';

@Injectable()
export class CareerService {
  private readonly logger = new Logger(CareerService.name);
  constructor(
    @InjectRepository(CareerEntity) private careerRepository: Repository<CareerEntity>,
    private connection: Connection,
  ) {}

  async createCareer(careerInput: CreateCareerInput) {
    this.logger.debug('create career');
    let career = new CareerEntity();
    career.setAttributes(careerInput);
    await this.connection.queryResultCache.clear();
    career = await this.careerRepository.save(career);
    return {
      data: career,
    };
  }

  async getAllCareer(
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
      // .where('career."deleted_at" is null')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('created_at', 'DESC');
    const countQuery: any = this.careerRepository.createQueryBuilder('career');

    if (countries?.length > 0) {
      const newSearchCountry = [];
      for (let value of countries) {
        value = value.replace(/  +/g, '');
        if (value) {
          newSearchCountry.push(convertTv(value.trim()));
        }
      }
      cacheKey += `searchValue${newSearchCountry}`;
      const bracket = new Brackets(qb => {
        qb.andWhere(`LOWER(convertTVkdau("career"."country")) In (:...countries)`, { countries: newSearchCountry });
      });
      careerQuery.andWhere(bracket);
      countQuery.andWhere(bracket);
    }

    if (status) {
      cacheKey += `searchValue${status}`;
      const bracket = new Brackets(qb => {
        qb.andWhere(`"career"."status" = '${status}'`);
      });
      careerQuery.andWhere(bracket);
      countQuery.andWhere(bracket);
    }
    if (searchValue) {
      searchValue = searchValue.replace(/  +/g, '');
      const titleConvert = convertTv(searchValue.trim());
      const searchTitle = `%${titleConvert}%`;
      cacheKey += `searchValue${searchTitle}`;
      const bracket = new Brackets(qb => {
        qb.andWhere(`LOWER(convertTVkdau("career"."title")) like '${searchTitle}'`);
      });
      careerQuery.andWhere(bracket);
      countQuery.andWhere(bracket);
    }

    let count: any = 0;
    count = await countQuery.cache(`${cacheKey}_count_page${page}_limit${limit}`).getCount();

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

  async getCareer(careerId: string) {
    this.logger.debug('get-career');
    const career = await this.careerRepository.findOne({ where: { id: careerId } });
    return {
      data: career,
    };
  }

  async updateCareer(careerId: string, careerInput: UpdateCareerInput) {
    this.logger.debug('update career');
    const careerUpdate = new CareerEntity();
    careerUpdate.setAttributes(careerInput);
    let currCareer = await this.careerRepository.findOne({ where: { id: careerId } });
    if (!currCareer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Career id ${careerId} is not exist `,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    currCareer = careerUpdate;
    await this.connection.queryResultCache.clear();
    await this.careerRepository.update({ id: careerId }, currCareer);
    return {
      data: currCareer,
    };
  }

  async deleteCareer(careerId: string) {
    this.logger.debug('delete career');
    const currCareer = await this.careerRepository.findOne({ where: { id: careerId } });
    if (!currCareer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Career id ${careerId} is not exist `,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await this.careerRepository.softRemove<CareerEntity>(currCareer);
  }
}
