import { SolutionEntity } from './../entities/solution.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { CreateSolutionInput, UpdateSolutionInput } from './solution.dto';
import { SolutionImageEntity } from '../entities/solutionImage.entity';
import { countSolution, isSolutionAvailable } from '../lib/subFunction/solution';
import { LanguageEntity } from '../entities/language.entity';

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
    const solutions = [];
    let isLanguageEN = false;
    //Need check max and different solution when create
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    for (const item of createSolutionList) {
      const language = await this.languageRepository.findOne({ where: { id: item.languageId } });
      if (language.code === 'EN') {
        isLanguageEN = true;
      }
    }
    if (isLanguageEN === false) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'MUST_CREATE_SOLUTION_ENGLISH',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
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
          newSolution.code = code;
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
          if (item.bannerImage) {
            const solutionImage: any = new SolutionImageEntity();
            solutionImage.image = item.bannerImage;
            solutionImage.solutionId = newSolution.id;
            solutionImage.isBanner = true;
            await transactionalEntityManager.save<SolutionImageEntity>(solutionImage);
          }
          solutions.push(newSolution);
        });
      }
    }
    return { data: solutions };
  }

  async getAllSolution(languageId: string, code?: string) {
    this.logger.debug('Get all solution');
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
    await this.connection.queryResultCache.clear();
    const currSolutions = await this.solutionRepository.find({ where: { code: code } });
    //check duplicate
    const checkDupLanguageInput = await isSolutionAvailable(data, this.languageRepository);
    if (checkDupLanguageInput === true) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'SOLUTION_LANGUAGE_DUPLICATE',
        },
        HttpStatus.CONFLICT,
      );
    }
    await getManager().transaction(async transactionalEntityManager => {
      for (const item of data) {
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
            const currImages = await this.solutionImageRepository.find({ where: { solutionId: item.id } });
            await transactionalEntityManager.update<SolutionImageEntity[]>(
              SolutionImageEntity,
              { solutionId: item.id },
              currImages,
            );
          } else {
            const solutionImages = await this.solutionImageRepository.find({ where: { solutionId: item.id } });
            await transactionalEntityManager.softRemove<SolutionImageEntity[]>(solutionImages);
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
    return { data: {} };
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
  }
}
