import { SolutionEntity } from './../entities/solution.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { CreateSolutionInput, UpdateSolutionInput } from './solution.dto';
import { countSolution, isSolutionAvailable } from '../lib/subFunction/solution';
import { LanguageEntity } from '../entities/language.entity';
import { isDuplicateLanguageValid, isLanguageENValid } from '../lib/pipeUtils/languageValidate';

@Injectable()
export class SolutionService {
  private readonly logger = new Logger(SolutionService.name);

  constructor(
    @InjectRepository(SolutionEntity)
    private solutionRepository: Repository<SolutionEntity>,
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
    private connection: Connection,
  ) {}
  async uploadImage(image: any) {
    this.logger.debug('upload image solution');
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
        newSolution.code = randomCode;
        await this.solutionRepository.save<SolutionEntity>(newSolution);
        this.logger.debug('Create solution');
      }
    }
    return {};
  }

  async getAllSolution(languageId: string, code?: string) {
    this.logger.debug('Get all solution');
    await this.connection.queryResultCache.clear();
    const solutionQuery = this.solutionRepository.createQueryBuilder('solution');
    const query: any = solutionQuery
      .where('solution."deleted_at" is null AND solution."language_id"=:languageId', { languageId })
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
          if (currSolutions[index].title !== item.title) {
            const existTitle = await this.solutionRepository.findOne({
              where: { title: item.title, languageId: item.languageId },
            });
            if (existTitle) {
              throw new HttpException(
                {
                  statusCode: HttpStatus.CONFLICT,
                  message: `TITLE_HAS_BEEN_EXISTED `,
                },
                HttpStatus.CONFLICT,
              );
            }
          }
          currSolutions[index].setAttributes(item);
          //images update
          await transactionalEntityManager.update<SolutionEntity>(
            SolutionEntity,
            { id: item.id },
            currSolutions[index],
          );
        } else {
          const existTitle = await this.solutionRepository.findOne({
            where: { title: item.title, languageId: item.languageId },
          });
          if (existTitle) {
            throw new HttpException(
              {
                statusCode: HttpStatus.CONFLICT,
                message: `TITLE_HAS_BEEN_EXISTED `,
              },
              HttpStatus.CONFLICT,
            );
          }
          const newSolution = new SolutionEntity();
          newSolution.setAttributes(item);
          newSolution.code = code;
          await transactionalEntityManager.save<SolutionEntity>(newSolution);
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
        await transactionalEntityManager.softDelete(SolutionEntity, { id: solution[i].id });
      }
    });
    return {};
  }
}
