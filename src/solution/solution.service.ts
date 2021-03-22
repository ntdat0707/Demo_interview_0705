import { SolutionEntity } from './../entities/solution.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { CreateSolutionInput, UpdateSolutionInput } from './solution.dto';
import { SolutionImageEntity } from '../entities/solutionImage.entity';
import { countSolution, isSolutionAvailable } from '../lib/subFunction/solution';
import { LanguageEntity } from '../entities/language.entity';
import _ = require('lodash');
import { isDuplicateLanguageValid, isLanguageENValid } from '../lib/pipeUtils/languageValidate';

@Injectable()
export class SolutionService {
  private readonly logger = new Logger(SolutionService.name);

  constructor(
    @InjectRepository(SolutionEntity)
    private solutionRepository: Repository<SolutionEntity>,
    @InjectRepository(SolutionImageEntity)
    private solutionImageRepository: Repository<SolutionImageEntity>,
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
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

  async createSolution(createSolutionList: [CreateSolutionInput]) {
    this.logger.debug('Create solution');
    //Need check max and different solution when create
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existCode = await this.solutionRepository.findOne({ where: { code: randomCode } });
      if (!existCode) {
        break;
      }
    }
    await isLanguageENValid(createSolutionList, this.languageRepository);
    await isDuplicateLanguageValid(createSolutionList, this.languageRepository);
    for (const item of createSolutionList) {
      const currItems: any = await countSolution(this.solutionRepository, item.languageId);
      if (currItems.isValid === true) {
        const index: any = currItems.solutions.findIndex((solution: any) => solution.title === item.title);
        if (index > -1) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              message: 'SOLUTION_THIS_LANGUAGE_ALREADY_EXIST',
            },
            HttpStatus.CONFLICT,
          );
        }

        const newSolution = new SolutionEntity();
        newSolution.setAttributes(item);
        await this.connection.queryResultCache.clear();
        await getManager().transaction(async transactionalEntityManager => {
          newSolution.code = randomCode;
          await transactionalEntityManager.save<SolutionEntity>(newSolution);
          this.logger.debug('Create solution');
          if ((item.images && item.images.length > 0) || item.bannerImage) {
            if (item.images && item.images.length > 0) {
              const solutionImages = [];
              for (const solution of item.images) {
                const solutionImage: any = new SolutionImageEntity();
                solutionImage.image = solution.image;
                solutionImage.solutionId = newSolution.id;
                solutionImages.push(solutionImage);
              }
              await transactionalEntityManager.save<SolutionImageEntity[]>(solutionImages);
            }
          }
        });
      }
    }
    return {};
  }

  async getAllSolution(languageId: string, code?: string) {
    this.logger.debug('Get all solution');
    await this.connection.queryResultCache.clear();
    const solutionQuery = this.solutionRepository.createQueryBuilder('solution');
    const query: any = solutionQuery
      .leftJoinAndMapMany(
        'solution.images',
        SolutionImageEntity,
        'solution_image',
        '"solution_image"."solution_id"="solution".id',
      )
      .where('solution."deleted_at" is null')
      .andWhere(`solution."language_id"='${languageId}'`)
      .andWhere('"solution_image"."is_banner" is false')
      .orderBy('solution."created_at"', 'DESC');
    if (code) {
      query.andWhere(`solution."code" = '${code}'`);
    }
    const solutions = await query.getMany();
    return {
      data: solutions,
    };
  }

  async updateSolution(code: string, data: [UpdateSolutionInput]) {
    this.logger.debug('update solution');
    await isDuplicateLanguageValid(data, this.languageRepository);
    await this.connection.queryResultCache.clear();
    const currSolutions = await this.solutionRepository.find({ where: { code: code } });
    //check duplicate
    await isSolutionAvailable(data, this.languageRepository);
    await getManager().transaction(async transactionalEntityManager => {
      for (const item of data) {
        const existTitle = await this.solutionRepository.findOne({ where: { title: item.title } });
        if (existTitle) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              message: `TITLE_HAS_BEEN_EXISTED `,
            },
            HttpStatus.CONFLICT,
          );
        }
        if (item.id) {
          const index = currSolutions.findIndex((x: any) => x.id === item.id);
          if (index === -1) {
            throw new HttpException(
              {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'SOLUTION_NOT_FOUND',
              },
              HttpStatus.NOT_FOUND,
            );
          }
          currSolutions[index].setAttributes(item);
          //images update
          if (item.images && item.images.length > 0) {
            const solutionImages = await this.solutionImageRepository.find({ where: { solutionId: item.id } });
            const curImages = solutionImages.map((x: any) => {
              const y = { image: x.image };
              return y;
            });
            const addImages = _.difference(item.images, curImages);
            const diffImages = _.difference(curImages, item.images);
            if (addImages.length > 0) {
              const newImages: any = [];
              for (const image of addImages) {
                const newImage = new SolutionImageEntity();
                newImage.solutionId = item.id;
                newImage.image = image.image;
                newImages.push(newImage);
              }
              await transactionalEntityManager.save<SolutionImageEntity[]>(newImages);
            }
            if (diffImages.length > 0) {
              for (const image of diffImages) {
                const indexImage = solutionImages.findIndex((x: any) => x.image === image.image);
                if (indexImage > -1) {
                  await transactionalEntityManager.softDelete<SolutionImageEntity>(
                    SolutionImageEntity,
                    solutionImages[indexImage],
                  );
                }
              }
            }
          } else {
            const solutionImages = await this.solutionImageRepository.find({ where: { solutionId: item.id } });
            await transactionalEntityManager.softDelete<SolutionImageEntity[]>(SolutionImageEntity, solutionImages);
          }
          await transactionalEntityManager.update<SolutionEntity>(
            SolutionEntity,
            { id: item.id },
            currSolutions[index],
          );
        } else {
          const newSolution = new SolutionEntity();
          newSolution.setAttributes(item);
          newSolution.code = code;
          await transactionalEntityManager.save<SolutionEntity>(newSolution);
          if ((item.images && item.images.length > 0) || item.bannerImage) {
            if (item.images && item.images.length > 0) {
              const solutionImages = [];
              for (const solution of item.images) {
                const solutionImage: any = new SolutionImageEntity();
                solutionImage.image = solution.image;
                solutionImage.solutionId = newSolution.id;
                solutionImages.push(solutionImage);
              }
              await transactionalEntityManager.save<SolutionImageEntity[]>(solutionImages);
            }
          }
          if (item.bannerImage) {
            const solutionImage: any = new SolutionImageEntity();
            solutionImage.image = item.bannerImage;
            solutionImage.solutionId = newSolution.id;
            solutionImage.isBanner = true;
            await transactionalEntityManager.save<SolutionImageEntity>(solutionImage);
          }
        }
      }
    });
    return {};
  }

  async deleteSolution(code: string) {
    this.logger.debug('delete solution');
    const solution: any = await this.solutionRepository.find({ where: { code: code } });
    if (!solution) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'SOLUTION_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      for (let i = 0; i < solution.length; i++) {
        const solutionImages = await this.solutionImageRepository.find({ where: { id: solution[i].id } });
        await transactionalEntityManager.softRemove<SolutionImageEntity[]>(solutionImages);
        await transactionalEntityManager.softDelete(SolutionEntity, { id: solution[i].id });
      }
    });
    return {};
  }
}
