import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { FocusedEntity } from '../entities/focused.entity';

@Injectable()
export class FocusedMarketService {
  private readonly logger = new Logger(FocusedMarketService.name);
  constructor(
    @InjectRepository(FocusedEntity) private focusedMarketRepository: Repository<FocusedEntity>,
    private connection: Connection,
  ) {}

  // async createSolution(createSolutionList: [CreateSolutionInput]) {
  //   this.logger.debug('Create solution');
  //   const solutions = [];
  //   let isLanguageEN = false;
  //   //Need check max and different solution when create
  //   const code = Math.random()
  //     .toString(36)
  //     .substring(2, 8)
  //     .toUpperCase();
  //   for (const item of createSolutionList) {
  //     const language = await this.languageRepository.findOne({ where: { id: item.languageId } });
  //     if (language.code === 'EN') {
  //       isLanguageEN = true;
  //     }
  //   }
  //   if (isLanguageEN === false) {
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.BAD_REQUEST,
  //         message: 'MUST_CREATE_SOLUTION_ENGLISH',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   for (const item of createSolutionList) {
  //     const currItems: any = await countSolution(this.solutionRepository, item.languageId);
  //     if (currItems.isValid === true) {
  //       // const existPost = await this.solutionRepository
  //       // .createQueryBuilder('solution')
  //       // .where(`title ilike :title`, { title: `%"${item.title}"%` })
  //       // .getOne();
  //       const index: any = currItems.solutions.findIndex((solution: any) => solution.title === item.title);

  //       if (index > -1) {
  //         throw new HttpException(
  //           {
  //             statusCode: HttpStatus.CONFLICT,
  //             message: 'SOLUTION_THIS_LANGUAGE_ALREADY_EXIST',
  //           },
  //           HttpStatus.CONFLICT,
  //         );
  //       }

  //       const newSolution = new SolutionEntity();
  //       newSolution.setAttributes(item);
  //       await this.connection.queryResultCache.clear();
  //       await getManager().transaction(async transactionalEntityManager => {
  //         newSolution.code = code;
  //         await transactionalEntityManager.save<SolutionEntity>(newSolution);
  //         this.logger.debug('Create solution');
  //         if ((item.images && item.images.length > 0) || item.bannerImage) {
  //           if (item.images && item.images.length > 0) {
  //             const solutionImages = [];
  //             for (const solution of item.images) {
  //               const solutionImage: any = new SolutionImageEntity();
  //               solutionImage.image = solution.image;
  //               solutionImage.solutionId = newSolution.id;
  //               solutionImages.push(solutionImage);
  //             }
  //             await transactionalEntityManager.save<SolutionImageEntity[]>(solutionImages);
  //           }
  //         }
  //         if (item.bannerImage) {
  //           const solutionImage: any = new SolutionImageEntity();
  //           solutionImage.image = item.bannerImage;
  //           solutionImage.solutionId = newSolution.id;
  //           solutionImage.isBanner = true;
  //           await transactionalEntityManager.save<SolutionImageEntity>(solutionImage);
  //         }
  //         solutions.push(newSolution);
  //       });
  //     }
  //   }
  //   return { data: solutions };
  // }
}
