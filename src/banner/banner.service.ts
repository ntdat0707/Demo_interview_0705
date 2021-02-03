import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, LessThan, Repository } from 'typeorm';
import { BannerEntity } from '../entities/banner.entity';
import { BannerIndexInput, BannerInput } from './banner.dto';
@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);
  constructor(
    @InjectRepository(BannerEntity) private bannerRepository: Repository<BannerEntity>,
    private connection: Connection,
  ) {}

  async uploadImage(image: any) {
    this.logger.debug('upload image banner');
    if (!image) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'IMAGE_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      data: {
        picture: image.filename,
      },
    };
  }

  async createBanner(bannerInput: BannerInput) {
    this.logger.debug('create banner');
    let banner = new BannerEntity();
    banner.setAttributes(bannerInput);
    await this.connection.queryResultCache.clear();
    banner = await this.bannerRepository.save(banner);
    return {
      data: banner,
    };
  }

  async updateBanner(id: string, bannerInput: BannerInput) {
    this.logger.debug('update banner');
    let banner = await this.bannerRepository.findOne({ where: { id: id } });
    if (!banner) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'BANNER_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    banner.setAttributes(bannerInput);
    await this.connection.queryResultCache.clear();
    banner = await this.bannerRepository.save(banner);
    return {
      data: banner,
    };
  }

  async getBanner(id: string) {
    this.logger.debug('get banner');
    const banner = await this.bannerRepository.findOne({ where: { id: id } });
    if (!banner) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'BANNER_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: banner,
    };
  }

  async deleteBanner(id: string) {
    this.logger.debug('delete banner');
    const banner = await this.bannerRepository.findOne({ where: { id: id } });
    if (!banner) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'BANNER_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await this.bannerRepository.softDelete(banner);
    return {};
  }

  async getAllBanner(page = 1, limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10)) {
    this.logger.debug('get all banner');
    const queryExc = this.bannerRepository
      .createQueryBuilder('banner')
      .orderBy('banner_valid_to', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);
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
        await transactionalEntityManager.update(BannerEntity, { id: banner.id }, { index: 0 });
      }
      for (const input of listBanner) {
        await transactionalEntityManager.update(BannerEntity, { id: input.id }, { index: input.index });
      }
    });
    return {};
  }
}
