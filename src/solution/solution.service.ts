import { SolutionEntity } from './../entities/solution.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { CreateSolutionInput } from './solution.dto';
import { SolutionImageEntity } from '../entities/solutionImage.entity';
import { mapDataResource } from '../lib/mapData/resource';

@Injectable()
export class SolutionService {
  private readonly logger = new Logger(SolutionService.name);

  constructor(
    @InjectRepository(SolutionEntity)
    private solutionRepository: Repository<SolutionEntity>,
    @InjectRepository(SolutionEntity)
    private solutionImageRepository: Repository<SolutionImageEntity>,

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
    //Need check max and different solution when create
    for (const item of createSolutionList) {
      const existPost = await this.solutionRepository
        .createQueryBuilder('solution')
        .where(`title ilike :title`, { title: `%"${item.title}"%` })
        .getOne();
      if (existPost) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'SOLUTION_ALREADY_EXIST',
          },
          HttpStatus.CONFLICT,
        );
      }
      let newSolution = new SolutionEntity();
      newSolution.setAttributes(item);
      await this.connection.queryResultCache.clear();
      await getManager().transaction(async transactionalEntityManager => {
        newSolution = await transactionalEntityManager.save<SolutionEntity>(newSolution);
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
          solutionImage.image = item.bannerImage.image;
          solutionImage.solutionId = newSolution.id;
          solutionImage.isBanner = true;
          await transactionalEntityManager.save<SolutionImageEntity>(solutionImage);
        }
        solutions.push(newSolution);
      });
    }
    return { data: solutions };
  }

  async getAllSolution(page = 1, limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10)) {
    const solutionQuery = this.solutionRepository.createQueryBuilder('solutionId');
    const solutionCount = await solutionQuery.cache(`solution_count_page${page}_limit${limit}`).getCount();
    const solutions: any = await solutionQuery
      .leftJoinAndMapMany(
        'solution.images',
        SolutionImageEntity,
        'solution_image',
        '"solution_image"."solution_id"="solution".id',
      )
      .where('solution."deleted_at" is null')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('solution."created_at"', 'DESC')
      .cache(`solutions_page${page}_limit${limit}`)
      .getMany();

    const pages = Math.ceil(Number(solutionCount) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: solutionCount,
      data: mapDataResource(solutions, true),
    };
  }
}
