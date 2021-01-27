import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BannerEntity } from '../entities/banner.entity';
import { BannerInput } from './banner.dto';
import fs = require('fs');
@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);
  constructor(
    @InjectRepository(BannerEntity) private bannerRepository: Repository<BannerEntity>,
    private connection: Connection,
  ) {}

  async createBanner(imageBanner: any, bannerInput: BannerInput) {
    this.logger.debug('create banner');
    let banner = new BannerEntity();
    banner.setAttributes(bannerInput);
    if (imageBanner) {
      banner.image = imageBanner.filename;
    }
    await this.connection.queryResultCache.clear();
    banner = await this.bannerRepository.save(banner);
    return {
      data: banner,
    };
  }

  async updateBanner(id: string, imageBanner: any, bannerInput: BannerInput) {
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
    let pathFile = '';
    if (banner.image) {
      pathFile = process.env.BANNER_IMAGE_PATH + '/' + banner.image;
    }
    banner.setAttributes(bannerInput);
    if (imageBanner) {
      banner.image = imageBanner.filename;
    }
    await this.connection.queryResultCache.clear();
    banner = await this.bannerRepository.save(banner);
    if (pathFile !== '') {
      fs.unlinkSync(pathFile);
    }
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
}
