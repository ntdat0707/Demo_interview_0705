import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CountryEntity } from '../entities/country.entity';
import { BranchInput, CountryInput } from './network.dto';
import fs = require('fs');
import { BranchEntity } from '../entities/branch.entity';

@Injectable()
export class NetworkService {
  private readonly logger = new Logger(NetworkService.name);
  constructor(
    @InjectRepository(CountryEntity) private countryRepository: Repository<CountryEntity>,
    @InjectRepository(BranchEntity) private branchRepository: Repository<BranchEntity>,
    private connection: Connection,
  ) {}

  async getAllCountry() {
    this.logger.debug('get all country');
    const countries = await this.countryRepository.find();
    return {
      data: countries,
    };
  }

  async createCountry(image: any, countryInput: CountryInput) {
    this.logger.debug('create country');
    const country = await this.countryRepository.findOne({ where: { name: countryInput.name } });
    if (country) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'COUNTRY_NAME_EXIST',
        },
        HttpStatus.CONFLICT,
      );
    }
    let newCountry = new CountryEntity();
    newCountry.setAttributes(countryInput);
    if (image) {
      newCountry.image = image.filename;
    }
    this.connection.queryResultCache.clear();
    newCountry = await this.countryRepository.save(newCountry);
    return {
      data: newCountry,
    };
  }

  async updateCountry(id: string, image: any, countryInput: CountryInput) {
    this.logger.debug('update country');
    const country = await this.countryRepository.findOne({ where: { id: id } });
    if (!country) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'COUNTRY_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (country.name !== countryInput.name) {
      const existCountry = await this.countryRepository.findOne({ where: { name: countryInput.name } });
      if (existCountry) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'COUNTRY_EXIST',
          },
          HttpStatus.CONFLICT,
        );
      }
    }
    let pathFile = '';
    if (country.image) {
      pathFile = process.env.UPLOAD_COUNTRY_PATH + '/' + country.image;
    }
    country.setAttributes(countryInput);
    if (image) {
      country.image = image.filename;
    }
    await this.connection.queryResultCache.clear();
    await this.countryRepository.save(country);
    if (pathFile !== '') {
      fs.unlinkSync(pathFile);
    }
    return {};
  }

  async createBranch(branchInput: BranchInput) {
    this.logger.debug('create branch');
    const existCountry = await this.countryRepository.findOne({ where: { id: branchInput.countryId } });
    if (!existCountry) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'COUNTRY_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    let newBranch = new BranchEntity();
    newBranch.setAttributes(branchInput);
    newBranch = await this.branchRepository.save(newBranch);
    return {
      data: newBranch,
    };
  }

  async updateBranch(id: string, branchInput: BranchInput) {
    this.logger.debug('update branch');
    const branch = await this.branchRepository.findOne({ where: { id: id } });
    if (!branch) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'BRANCH_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (branch.countryId !== branchInput.countryId) {
      const country = await this.countryRepository.findOne({ where: { id: branchInput.countryId } });
      if (!country) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'COUNTRY_NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
    branch.setAttributes(branchInput);
    await this.connection.queryResultCache.clear();
    await this.branchRepository.save(branch);
    return {};
  }

  async getAllBranch(
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    // searchValue: string,
  ) {
    this.logger.debug('get all branch');
    const queryExc = this.branchRepository
      .createQueryBuilder('branch')
      .orderBy('created_at')
      .where('')
      .limit(limit)
      .offset((page - 1) * limit);
    // if (searchValue) {
    //   searchValue = convertTv(searchValue.replace(/  +/g, '').trim());
    //   queryExc.andWhere(`lower(name) like :value`, {
    //     value: `%${searchValue}%`,
    //   });
    // }
    this.connection.queryResultCache.clear();
    const countResult = await queryExc.cache(`branchs_count_page${page}_limit${limit}`).getCount();
    const result = await queryExc.cache(`branchs__page${page}_limit${limit}`).getMany();
    const pages = Math.ceil(Number(countResult) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: countResult,
      data: result,
    };
  }

  async getBranch(id: string) {
    this.logger.debug('get branch');
    const branch = await this.branchRepository.findOne({ where: { id: id } });
    if (!branch) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'BRANCH_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: branch,
    };
  }

  async deleteBranch(id: string) {
    this.logger.debug('delete branch');
    const branch = await this.branchRepository.findOne({ where: { id: id } });
    if (!branch) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'BRANCH_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await this.branchRepository.softDelete(branch);
    return {};
  }
}
