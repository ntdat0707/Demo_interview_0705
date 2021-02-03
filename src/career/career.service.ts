import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CareerEntity } from '../entities/career.entity';
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

  async getAllCareer(page = 1, limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10)) {
    this.logger.debug('get-all-career');
    const careerQuery = this.careerRepository.createQueryBuilder('career');
    const careerCount = await careerQuery.cache(`career_count_page${page}_limit${limit}`).getCount();
    const careers = await careerQuery
      .where('career."deleted_at" is null')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('created_at', 'DESC')
      .cache(`career_page${page}_limit${limit}`)
      .getMany();
    const pages = Math.ceil(Number(careerCount) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: careerCount,
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
