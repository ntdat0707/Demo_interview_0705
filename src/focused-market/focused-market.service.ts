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
    @InjectRepository(FocusedImageEntity) private focusedMarketImageRepository: Repository<FocusedImageEntity>,
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
      .select('DISTINCT focused_market."code"')
      .getRawMany();
    if (countFocusedMarket.length >= 10) {
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
      .where(`language_id = :value`, { value: `${languageId}` })
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
        'focused_market_image."focused_id" = focused_market."id" and focused_market_image."deleted_at" is null',
      );
    if (languageId) {
      queryExc.andWhere(`language_id = :languageId`, { languageId: `${languageId}` });
    }
    const focusedMarket = await queryExc.getMany();
    if (focusedMarket.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'FOCUSED_MARKET_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: focusedMarket,
    };
  }

  async updateFocusedMarket(code: string, focusedMarketList: [FocusedMarketInput]) {
    this.logger.debug('update focused market');
    const oldFocusedMarket = await this.focusedMarketRepository.find({ where: { code: code } });
    if (oldFocusedMarket.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'FOCUSED_MARKET_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
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
    let isLanguageEN: boolean = false;
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
    }

    if (isLanguageEN === false) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FOCUSED_MARKET_MUST_BE_HAD_ENGLISH',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      for (const focusedMarket of focusedMarketList) {
        if (focusedMarket.id) {
          const index = oldFocusedMarket.findIndex((x: any) => x.id === focusedMarket.id);
          if (index === -1) {
            throw new HttpException(
              {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'FOCUSED_MARKET_NOT_FOUND',
              },
              HttpStatus.NOT_FOUND,
            );
          }
          oldFocusedMarket[index].setAttributes(focusedMarket);
          await transactionalEntityManager.save<FocusedEntity>(oldFocusedMarket[index]);
          const focusedImages = await this.focusedMarketImageRepository.find({
            where: { focusedId: focusedMarket.id },
          });
          if (focusedMarket.images && focusedMarket.images.length > 0) {
            const oldFocusedMarketImage: string[] = focusedImages.map((item: any) => {
              return item.image;
            });
            const newFocusedMarketImage: string[] = focusedMarket.images.map((item: any) => {
              return item.image;
            });
            const addFocusedMarketImage = _.difference(newFocusedMarketImage, oldFocusedMarketImage);
            if (addFocusedMarketImage.length > 0) {
              const listFocusedMarketImage = [];
              addFocusedMarketImage.map((item: any) => {
                const dataFocusedImage = new FocusedImageEntity();
                dataFocusedImage.focusedId = focusedMarket.id;
                dataFocusedImage.image = item;
                listFocusedMarketImage.push(dataFocusedImage);
              });
              await transactionalEntityManager.save<FocusedImageEntity>(listFocusedMarketImage);
            }
            const deleteFocusedMarketImage: any = _.difference(oldFocusedMarketImage, newFocusedMarketImage);
            if (deleteFocusedMarketImage.length > 0) {
              for (const item of deleteFocusedMarketImage) {
                const indexImage = focusedImages.findIndex((x: any) => x.image === item);
                if (indexImage !== -1) {
                  await transactionalEntityManager.softDelete<FocusedImageEntity>(
                    FocusedImageEntity,
                    focusedImages[indexImage],
                  );
                }
              }
            }
          } else {
            if (focusedImages.length > 0) {
              await transactionalEntityManager.softDelete<FocusedImageEntity[]>(FocusedImageEntity, focusedImages);
            }
          }
        } else {
          const newFocusedMarket = new FocusedEntity();
          newFocusedMarket.setAttributes(focusedMarket);
          newFocusedMarket.code = code;
          newFocusedMarket.id = uuidv4();
          const dataForcusedMarketImage = [];
          for (const focusImage of focusedMarket.images) {
            const focusedMarketImage = new FocusedImageEntity();
            focusedMarketImage.image = focusImage.image;
            focusedMarketImage.focusedId = newFocusedMarket.id;
            dataForcusedMarketImage.push(focusedMarketImage);
          }
          await transactionalEntityManager.save<FocusedEntity>(newFocusedMarket);
          await transactionalEntityManager.save<FocusedImageEntity>(dataForcusedMarketImage);
        }
      }
    });
    return {};
  }

  async deleteFocusedMarket(code: string) {
    const focusedMarkets = await this.focusedMarketRepository.find({ where: { code: code } });
    if (focusedMarkets.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'FOCUSED_MARKET_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      focusedMarkets.map(async (focusedMarket: any) => {
        const focusedImages = await this.focusedMarketImageRepository.find({ where: { focused_id: focusedMarket.id } });
        await transactionalEntityManager.softDelete<FocusedImageEntity[]>(FocusedImageEntity, focusedImages);
      });
      await transactionalEntityManager.softDelete<FocusedEntity[]>(FocusedEntity, focusedMarkets);
    });
    return {};
  }
}
