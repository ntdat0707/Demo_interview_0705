import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Connection, getManager, Repository } from 'typeorm';
import { FocusedEntity } from '../entities/focused.entity';
import { FocusedImageEntity } from '../entities/focusedImage.entity';
import { LanguageEntity } from '../entities/language.entity';
import { FocusedMarketInput } from './focused-market.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FocusedMarketService {
  private readonly logger = new Logger(FocusedMarketService.name);
  constructor(
    @InjectRepository(FocusedEntity) private focusedMarketRepository: Repository<FocusedEntity>,
    @InjectRepository(LanguageEntity) private languageRepository: Repository<LanguageEntity>,
    private connection: Connection,
  ) {}

  async uploadImage(image: any) {
    this.logger.debug('upload image');
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
        image: image.filename,
      },
    };
  }

  async createFocusedMarket(focusedMarketList: [FocusedMarketInput]) {
    this.logger.debug('Create focused market');
    const countFocusedMarket = await this.focusedMarketRepository
      .createQueryBuilder('focused_market')
      .select('DISTINCT ON focused_market."code"')
      .getCount();
    if (countFocusedMarket >= 10) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CAN_NOT_CREATE_FOCUSED_MARKET',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const checkLanguage = focusedMarketList.map((value: any) => {
      return value.languageId;
    });
    if (_.uniq(checkLanguage).length !== checkLanguage.length) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'DUPLICATE_LANGUAGE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const dataForcusedMarket = [];
    const dataForcusedMarketImage = [];
    let isLanguageEN = false;
    for (const item of focusedMarketList) {
      const language = await this.languageRepository.findOne({ where: { id: item.languageId } });
      if (!language) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'LANGUAGE_NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (language.code === 'EN') {
        isLanguageEN = true;
      }
      const checkTitle = await this.focusedMarketRepository.findOne({
        where: { languageId: item.languageId, title: item.title },
      });
      if (checkTitle) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'FOCUSED_MARKET_ALREADY_EXIST',
          },
          HttpStatus.CONFLICT,
        );
      }
      const focusedMarket = new FocusedEntity();
      focusedMarket.setAttributes(item);
      focusedMarket.code = code;
      focusedMarket.id = uuidv4();
      for (const focusImage of item.images) {
        const focusedMarketImage = new FocusedImageEntity();
        focusedMarketImage.image = focusImage.image;
        focusedMarketImage.focusedId = focusedMarket.id;
        dataForcusedMarketImage.push(focusedMarketImage);
      }
      dataForcusedMarket.push(focusedMarket);
    }
    if (isLanguageEN === true) {
      await this.connection.queryResultCache.clear();
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save<FocusedEntity>(dataForcusedMarket);
        await transactionalEntityManager.save<FocusedImageEntity>(dataForcusedMarketImage);
      });
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FOCUSED_MARKET_MUST_BE_HAD_ENGLISH',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {};
  }

  async getAllFocusedMarket(languageId: string) {
    this.logger.debug('get all focused market');
    const focusedMarket = await this.focusedMarketRepository
      .createQueryBuilder('focused_market')
      .where(`languageId = :value`, { value: `${languageId}` })
      .orderBy('created_at', 'DESC')
      .getMany();
    return {
      data: focusedMarket,
    };
  }

  async getFocusedMarket(code: string, languageId?: string) {
    this.logger.debug('get focused market');
    const queryExc = this.focusedMarketRepository
      .createQueryBuilder('focused_market')
      .where(`code = :value`, { value: `${code}` })
      .leftJoinAndMapMany(
        'focused_market.images',
        FocusedImageEntity,
        'focused_market_image',
        'focused_market_image."focusedId" = focused_market."id"',
      );
    if (languageId) {
      queryExc.andWhere(`languageId = :value`, { value: `${languageId}` });
    }
    const focusedMarket = await queryExc.getMany();
    if (focusedMarket.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'LANGUAGE_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: focusedMarket,
    };
  }
}
