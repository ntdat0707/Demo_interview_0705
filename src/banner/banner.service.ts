import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BannerEntity } from '../entities/banner.entity';
import { CreateBannerInput } from './banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity) private bannerRepository: Repository<BannerEntity>,
    private connection: Connection,
  ) {}

  async createBanner(imageBanner: any, bannerInput: CreateBannerInput) {
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
}
