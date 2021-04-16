import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Connection, getManager, Repository } from 'typeorm';
import { FocusedEntity } from '../entities/focused.entity';
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
    this.logger.debug('upload image focused ');
    if (!image) {
      throw new BadRequestException('IMAGE_REQUIRED');
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
      throw new BadRequestException('CAN_NOT_CREATE_FOCUSED_MARKET');
    }
    const checkLanguage = focusedMarketList.map((value: any) => {
      return value.languageId;
    });
    if (_.uniq(checkLanguage).length !== checkLanguage.length) {
      throw new BadRequestException('DUPLICATE_LANGUAGE');
    }
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existFocusedCode = await this.focusedMarketRepository.findOne({ where: { code: randomCode } });
      if (!existFocusedCode) {
        break;
      }
    }
    const dataForcusedMarket = [];
    let isLanguageEN = false;
    for (const item of focusedMarketList) {
      const language = await this.languageRepository.findOne({ where: { id: item.languageId } });
      if (!language) {
        throw new NotFoundException('LANGUAGE_NOT_FOUND');
      }
      if (language.code === 'EN') {
        isLanguageEN = true;
      }
      const checkTitle = await this.focusedMarketRepository.findOne({
        where: { languageId: item.languageId, title: item.title },
      });
      if (checkTitle) {
        throw new ConflictException('TITLE_EXISTED');
      }
      const focusedMarket = new FocusedEntity();
      focusedMarket.setAttributes(item);
      focusedMarket.code = randomCode;
      focusedMarket.id = uuidv4();
      dataForcusedMarket.push(focusedMarket);
    }
    if (isLanguageEN === true) {
      await this.connection.queryResultCache.clear();
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save<FocusedEntity>(dataForcusedMarket);
      });
    } else {
      throw new BadRequestException('FOCUSED_MARKET_MUST_BE_HAD_ENGLISH');
    }
    return {};
  }

  async getAllFocusedMarket(languageId: string, status?: string) {
    this.logger.debug('get all focused market');
    const queryExc = this.focusedMarketRepository
      .createQueryBuilder('focused_market')
      .where(`language_id = :value`, { value: `${languageId}` })
      .orderBy('created_at', 'DESC');
    if (status) {
      queryExc.andWhere('status = :status', { status });
    }
    const focusedMarket = await queryExc.getMany();
    return {
      data: focusedMarket,
    };
  }

  async getFocusedMarket(code: string, languageId?: string) {
    this.logger.debug('get focused market');
    const queryExc = this.focusedMarketRepository
      .createQueryBuilder('focused_market')
      .where(`code = :value`, { value: `${code}` });
    if (languageId) {
      queryExc.andWhere(`language_id = :languageId`, { languageId: `${languageId}` });
    }
    const focusedMarket = await queryExc.getMany();
    if (focusedMarket.length === 0) {
      throw new NotFoundException('FOCUSED_MARKET_NOT_FOUND');
    }
    return {
      data: focusedMarket,
    };
  }

  async updateFocusedMarket(code: string, focusedMarketList: [FocusedMarketInput]) {
    this.logger.debug('update focused market');
    const oldFocusedMarket = await this.focusedMarketRepository.find({ where: { code: code } });
    if (oldFocusedMarket.length === 0) {
      throw new NotFoundException('FOCUSED_MARKET_NOT_FOUND');
    }
    const checkLanguage = focusedMarketList.map((value: any) => {
      return value.languageId;
    });
    if (_.uniq(checkLanguage).length !== checkLanguage.length) {
      throw new BadRequestException('DUPLICATE_LANGUAGE');
    }
    let isLanguageEN: boolean = false;
    let languageEnId: string;
    for (const item of focusedMarketList) {
      const language = await this.languageRepository.findOne({ where: { id: item.languageId } });
      if (!language) {
        throw new NotFoundException('LANGUAGE_NOT_FOUND');
      }
      if (language.code === 'EN') {
        languageEnId = language.id;
        isLanguageEN = true;
      }
    }

    if (isLanguageEN === false) {
      throw new BadRequestException('FOCUSED_MARKET_MUST_BE_HAD_ENGLISH');
    }

    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      for (const focusedMarket of focusedMarketList) {
        if (focusedMarket.id) {
          const index = oldFocusedMarket.findIndex((x: any) => x.id === focusedMarket.id);
          if (index === -1) {
            throw new NotFoundException('FOCUSED_MARKET_NOT_FOUND');
          }
          if (focusedMarket.title !== oldFocusedMarket[index].title) {
            const checkTitle = await this.focusedMarketRepository.findOne({
              where: { languageId: focusedMarket.languageId, title: focusedMarket.title },
            });
            if (checkTitle) {
              throw new ConflictException('TITLE_EXISTED');
            }
          }
          oldFocusedMarket[index].setAttributes(focusedMarket);
          await transactionalEntityManager.save<FocusedEntity>(oldFocusedMarket[index]);
        } else {
          if (focusedMarket.languageId === languageEnId) {
            throw new BadRequestException('CAN NOT CREATE ENGLISH LANGUAGE FOR FOCUSED MARKET');
          }
          const checkTitle = await this.focusedMarketRepository.findOne({
            where: { languageId: focusedMarket.languageId, title: focusedMarket.title },
          });
          if (checkTitle) {
            throw new ConflictException('TITLE_EXISTED');
          }
          const newFocusedMarket = new FocusedEntity();
          newFocusedMarket.setAttributes(focusedMarket);
          newFocusedMarket.code = code;
          newFocusedMarket.id = uuidv4();
          await transactionalEntityManager.save<FocusedEntity>(newFocusedMarket);
        }
      }
    });
    return {};
  }

  async deleteFocusedMarket(code: string) {
    const focusedMarkets = await this.focusedMarketRepository.find({ where: { code: code } });
    if (focusedMarkets.length === 0) {
      throw new NotFoundException('FOCUSED_MARKET_NOT_FOUND');
    }
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.softDelete<FocusedEntity[]>(FocusedEntity, focusedMarkets);
    });
    return {};
  }
}
