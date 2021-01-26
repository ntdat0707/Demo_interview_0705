import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { ResourceEntity } from '../entities/resource.entity';
import { ResourceAuthorEntity } from '../entities/resourceAuthor.entity';
import { ResourceCateEntity } from '../entities/resourceCate.entity';
import { ResourceImageEntity } from '../entities/resourceImage.entity';
import { ResourceLabelEntity } from '../entities/resourceLabel.entity';

import { CreateResourceInput } from './resource.dto';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);
  constructor(
    @InjectRepository(ResourceEntity)
    private resourceRepository: Repository<ResourceEntity>,
    @InjectRepository(ResourceAuthorEntity)
    private resourceAuthorRepository: Repository<ResourceAuthorEntity>,
    @InjectRepository(ResourceCateEntity)
    private resourceCateRepository: Repository<ResourceCateEntity>,
    @InjectRepository(ResourceImageEntity)
    private resourceImageRepository: Repository<ResourceImageEntity>,
    @InjectRepository(ResourceLabelEntity)
    private ResourceLabelEntityRepository: Repository<ResourceLabelEntity>,
  ) {}
  async createResource(createResource: CreateResourceInput) {
    this.logger.debug(`Running api createManyProduct at ${new Date()}`);
    const existPost = await this.resourceRepository
      .createQueryBuilder('resource')
      .where(`title::text like :title`, { title: `%"${createResource.title}"%` })
      .andWhere('"deletedAt" is null')
      .getOne();
    if (existPost) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'POST_ALREADY_EXIST',
        },
        HttpStatus.CONFLICT,
      );
    }
    let newResource = new ResourceEntity();
    newResource.setAttributes(createResource);
    await getManager().transaction(async transactionalEntityManager => {
      newResource = await transactionalEntityManager.save<ResourceEntity>(newResource);
      if (createResource.categoryIds && createResource.categoryIds.length > 0) {
        const resourceCateList = [];
        for (const item of createResource.categoryIds) {
          //check category
          const resourceCate = new ResourceCateEntity();
          resourceCate.resourceId = newResource.id;
          resourceCate.categoryId = item;
          resourceCateList.push(resourceCate);
        }
        await transactionalEntityManager.save<ResourceCateEntity[]>(resourceCateList);
      }
      if (createResource.authorId) {
        //check author
        const resourceAuthor = new ResourceAuthorEntity();
        resourceAuthor.resourceId = newResource.id;
        resourceAuthor.authorId = createResource.authorId;
        await transactionalEntityManager.save<ResourceAuthorEntity>(resourceAuthor);
      }
      if (createResource.labelIds && createResource.labelIds.length > 0) {
        //check label
        const resourceLabelList = [];
        for (const item of createResource.labelIds) {
          const resourceLabel = new ResourceLabelEntity();
          resourceLabel.resourceId = newResource.id;
          resourceLabel.labelId = item;
          resourceLabelList.push(resourceLabel);
        }
        await transactionalEntityManager.save<ResourceLabelEntity[]>(resourceLabelList);
      }
      // if()
    });
  }

  async uploadImage(image: any) {
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
        picture: image.filename,
      },
    };
  }
}
