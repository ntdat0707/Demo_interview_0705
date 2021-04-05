import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Connection, getManager, LessThan, Repository } from 'typeorm';
import { BannerEntity } from '../entities/banner.entity';
import { LanguageEntity } from '../entities/language.entity';
import { BannerIndexInput, BannerInput } from './banner.dto';
@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);
  constructor(
    @InjectRepository(BannerEntity) private bannerRepository: Repository<BannerEntity>,
    @InjectRepository(LanguageEntity) private languageRepository: Repository<LanguageEntity>,
    private connection: Connection,
  ) {}

  async uploadImage(image: any) {
    this.logger.debug('upload image banner');
    if (!image) {
      throw new BadRequestException('IMAGE_REQUIRED');
    }
    return {
      data: {
        picture: image.filename,
      },
    };
  }

  async createBanner(bannerInputs: [BannerInput]) {
    this.logger.debug('create banner');
    let isLanguageEN = false;
    const languageIds = [];
    const banners = [];
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existBannerCode = await this.bannerRepository.findOne({ where: { code: randomCode } });
      if (!existBannerCode) {
        break;
      }
    }
    for (const bannerInput of bannerInputs) {
      const language = await this.languageRepository.findOne({ where: { id: bannerInput.languageId } });
      if (!language) {
        throw new NotFoundException('LANGUAGE_NOT_FOUND');
      }
      if (language.code === 'EN') {
        isLanguageEN = true;
      }
      languageIds.push(bannerInput.languageId);
      const banner = new BannerEntity();
      banner.setAttributes(bannerInput);
      banner.code = randomCode;
      banners.push(banner);
    }
    if (_.uniq(languageIds).length !== languageIds.length) {
      throw new BadRequestException('DUPLICATE_LANGUAGE');
    }
    if (isLanguageEN === false) {
      throw new BadRequestException('BANNER_MUST_HAVE_ENGLISH');
    }
    await this.connection.queryResultCache.clear();
    await this.bannerRepository.save(banners);
    return {};
  }

  async updateBanner(code: string, bannerInputs: [BannerInput]) {
    this.logger.debug('update banner');
    const oldBanner = await this.bannerRepository.find({ where: { code: code } });
    if (oldBanner.length === 0) {
      throw new NotFoundException('BANNER_NOT_FOUND');
    }
    let isLanguageEN = false;
    const languageIds = [];
    let languageEnId: string;
    for (const bannerInput of bannerInputs) {
      const language = await this.languageRepository.findOne({ where: { id: bannerInput.languageId } });
      if (!language) {
        throw new NotFoundException('LANGUAGE_NOT_FOUND');
      }
      if (language.code === 'EN') {
        languageEnId = language.id;
        isLanguageEN = true;
      }
      languageIds.push(bannerInput.languageId);
    }
    if (_.uniq(languageIds).length !== languageIds.length) {
      throw new BadRequestException('DUPLICATE_LANGUAGE');
    }
    if (isLanguageEN === false) {
      throw new BadRequestException('BANNER_MUST_HAVE_ENGLISH');
    }

    for (const item of bannerInputs) {
      if (item.id) {
        const index = oldBanner.findIndex((x: any) => x.id === item.id);
        if (index === -1) {
          throw new NotFoundException('BANNER_NOT_FOUND');
        }
        oldBanner[index].setAttributes(item);
      } else {
        if (item.languageId === languageEnId) {
          throw new BadRequestException('CANNOT_CREATE_ENGLISH_FOR_BANNER');
        }
        const newBanner = new BannerEntity();
        newBanner.setAttributes(item);
        newBanner.code = code;
        oldBanner.push(newBanner);
      }
    }

    await this.connection.queryResultCache.clear();
    await this.bannerRepository.save(oldBanner);
    return {};
  }

  async getBanner(code: string, languageId?: string) {
    this.logger.debug('get banner');
    const queryExc = this.bannerRepository.createQueryBuilder('banner').where(`code = :value`, { value: `${code}` });
    if (languageId) {
      queryExc.andWhere(`language_id = :languageId`, { languageId: `${languageId}` });
    }
    await this.connection.queryResultCache.clear();
    const banners = await queryExc.getMany();
    if (banners.length === 0) {
      throw new NotFoundException('BANNER_NOT_FOUND');
    }
    return {
      data: banners,
    };
  }

  async deleteBanner(code: string) {
    this.logger.debug('delete banner');
    const banners = await this.bannerRepository.find({ where: { code: code } });
    if (banners.length === 0) {
      throw new NotFoundException('BANNER_NOT_FOUND');
    }
    await this.connection.queryResultCache.clear();
    await this.bannerRepository.softRemove(banners);
    return {};
  }

  async getAllBanner(
    languageId: string,
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
  ) {
    this.logger.debug('get all banner');
    const queryExc = this.bannerRepository
      .createQueryBuilder('banner')
      .where(`language_id = :value`, { value: `${languageId}` })
      .orderBy('banner_valid_to', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);
    await this.connection.queryResultCache.clear();
    const countResult = await queryExc.cache(`banners_count_page${page}_limit${limit}`).getCount();
    const result = await queryExc.cache(`banners__page${page}_limit${limit}`).getMany();
    const pages = Math.ceil(Number(countResult) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: countResult,
      data: result,
    };
  }

  async updateIndexBanner(listBanner: [BannerIndexInput]) {
    this.logger.debug('update index banner');
    const banners = await this.bannerRepository.find({ where: { index: LessThan(0) } });
    await getManager().transaction(async transactionalEntityManager => {
      await this.connection.queryResultCache.clear();
      for (const banner of banners) {
        await transactionalEntityManager.update(BannerEntity, { code: banner.code }, { index: 0 });
      }
      for (const input of listBanner) {
        await transactionalEntityManager.update(BannerEntity, { code: input.code }, { index: input.index });
      }
    });
    return {};
  }
}
