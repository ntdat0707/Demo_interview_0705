import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Connection, getManager, Repository } from 'typeorm';
import { AuthorEntity } from '../entities/author.entity';
import { CategoryEntity } from '../entities/category.entity';
import { LabelEntity } from '../entities/label.entity';
import { ResourceEntity } from '../entities/resource.entity';
import { ResourceAuthorEntity } from '../entities/resourceAuthor.entity';
import { ResourceCateEntity } from '../entities/resourceCate.entity';
import { ResourceImageEntity } from '../entities/resourceImage.entity';
import { ResourceLabelEntity } from '../entities/resourceLabel.entity';

import { CreateResourceInput, UpdateResourceInput } from './resource.dto';
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
    private resourceLabelEntityRepository: Repository<ResourceLabelEntity>,
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
        picture: image.filename,
      },
    };
  }

  async createResource(createResource: CreateResourceInput) {
    this.logger.debug('Create resource');
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
    await this.connection.queryResultCache.clear();
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
      // create imageAttach file
      if ((createResource.attachImages && createResource.attachImages.length > 0) || createResource.avatar) {
        if (createResource.attachImages && createResource.attachImages.length > 0) {
          const resourceImageList = [];
          for (const item of createResource.attachImages) {
            const resourceImage = new ResourceImageEntity();
            resourceImage.picture = item;
            resourceImage.resourceId = newResource.id;
            resourceImageList.push(resourceImage);
          }
          await transactionalEntityManager.save<ResourceImageEntity[]>(resourceImageList);
        }
        if (createResource.avatar) {
          const resourceImage = new ResourceImageEntity();
          resourceImage.picture = createResource.avatar;
          resourceImage.resourceId = newResource.id;
          resourceImage.alt = createResource.alt ? createResource.alt : '';
          resourceImage.isAvatar = true;
          await transactionalEntityManager.save<ResourceImageEntity>(resourceImage);
        }
      }
    });
    return { data: { resource: newResource } };
  }

  async getAllResource() {
    const resources = await this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndMapMany(
        'resource.images',
        ResourceImageEntity,
        'resource_image',
        '"resource_image"."resourceId"="resource".id',
      )
      .leftJoinAndMapMany(
        'resource.authors',
        ResourceAuthorEntity,
        'resource_author',
        '"resource_author"."resourceId"="resource".id',
      )
      .leftJoinAndMapOne('author', AuthorEntity, 'author', '"author".id="resource_author"."authorId"')
      .leftJoinAndMapOne(
        'resource.labels',
        ResourceLabelEntity,
        'resource_label',
        '"resource_label"."resourceId"="resource".id',
      )
      .leftJoinAndMapMany('labels', LabelEntity, 'label', '"label".id = "resource_label"."labelId"')
      .leftJoinAndMapMany(
        'resource.categories',
        ResourceCateEntity,
        'resource_category',
        '"resource_category"."resourceId"="resource".id',
      )
      .leftJoinAndMapMany('categories', CategoryEntity, 'category', '"category".id = "resource_category"."categoryId"')
      .getMany();
    return { data: resources };
  }

  async getResource(resourceId: any) {
    const resource = await this.resourceRepository
      .createQueryBuilder('resource')
      .where('"resource".id=:resourceId', { resourceId })
      .leftJoinAndMapMany(
        'resource.images',
        ResourceImageEntity,
        'resource_image',
        '"resource_image"."resourceId"="resource".id',
      )
      .leftJoinAndMapOne(
        'resource.authors',
        ResourceAuthorEntity,
        'resource_author',
        '"resource_author"."resourceId"="resource".id',
      )
      .leftJoinAndMapOne('authors', AuthorEntity, 'author', '"author".id="resource_author"."authorId"')
      .leftJoinAndMapMany(
        'resource.labels',
        ResourceLabelEntity,
        'resource_label',
        '"resource_label"."resourceId"="resource".id',
      )
      .leftJoinAndMapMany('labels', LabelEntity, 'label', '"label".id = "resource_label"."labelId"')
      .leftJoinAndMapMany(
        'resource.categories',
        ResourceCateEntity,
        'resource_category',
        '"resource_category"."resourceId"="resource".id',
      )
      .leftJoinAndMapMany('categories', CategoryEntity, 'category', '"category".id = "resource_category"."categoryId"')
      .getOne();
    return { data: resource };
  }

  async updateResource(resourceId: string, resourceUpdate: UpdateResourceInput, picture?: any) {
    let resource: any = await this.resourceRepository.findOne({ where: { id: resourceId } });
    if (!resource) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'RESOURCE_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    resource.setAttributes(resourceUpdate);
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      resource = await transactionalEntityManager.save<ResourceEntity>(resource);
      if (picture) {
        const resourceImage: any = await this.resourceImageRepository.findOne({ where: { resource_id: resourceId } });
        resourceImage.picture = picture;
        await transactionalEntityManager.save<ResourceImageEntity>(resourceImage);
      }
      if (!resource.authorId) {
        const resourceAuthor = await this.resourceAuthorRepository.findOne({ where: { resource_id: resourceId } });
        await transactionalEntityManager.softRemove<ResourceAuthorEntity>(resourceAuthor);
      }
      //update label
      const resourceLabels = await this.resourceLabelEntityRepository.find({ where: { resource_id: resourceId } });
      if (!resourceLabels.length) {
        const resourceLabelList = [];
        for (const item of resource.labelIds) {
          const resourceLabel = new ResourceLabelEntity();
          resourceLabel.resourceId = resourceId;
          resourceLabel.labelId = item;
          resourceLabelList.push(resourceLabel);
        }
        await transactionalEntityManager.save<ResourceLabelEntity[]>(resourceLabelList);
      } else {
        const currResourceLabelIds = resourceLabels.map((item: any) => item.labelId);
        const diff = _.difference(currResourceLabelIds, resource.labelIds);
        if (diff.length > 0) {
          const deleteResources = await this.resourceLabelEntityRepository.find({ where: { resource_id: diff } });
          await transactionalEntityManager.softRemove<ResourceLabelEntity[]>(deleteResources);
        }
        const add = _.difference(resource.labelIds, currResourceLabelIds);
        if (add.length > 0) {
          const resourceLabelList = [];
          for (const item of add) {
            const resourceLabel = new ResourceLabelEntity();
            resourceLabel.resourceId = resourceId;
            resourceLabel.labelId = item;
            resourceLabelList.push(resourceLabel);
          }
          await transactionalEntityManager.save<ResourceLabelEntity[]>(resourceLabelList);
        }
      }
      //update category
      const resourceCates = await this.resourceCateRepository.find({ where: { resource_id: resourceId } });
      if (!resourceCates.length) {
        const resourceCateList = [];
        for (const item of resource.categoryIds) {
          const resourceLabel = new ResourceCateEntity();
          resourceLabel.resourceId = resourceId;
          resourceLabel.categoryId = item;
          resourceCateList.push(resourceLabel);
        }
        await transactionalEntityManager.save<ResourceCateEntity[]>(resourceCateList);
      } else {
        const currResourceCateIds = resourceCates.map((item: any) => item.categoryId);
        const diff = _.difference(currResourceCateIds, resource.categoryIds);
        if (diff.length > 0) {
          const deleteCates = await this.resourceCateRepository.find({ where: { resource_id: diff } });
          await transactionalEntityManager.softRemove<ResourceCateEntity[]>(deleteCates);
        }
        const add = _.difference(resource.labelIds, currResourceCateIds);
        if (add.length > 0) {
          const resourceCateList = [];
          for (const item of add) {
            const resourceLabel = new ResourceCateEntity();
            resourceLabel.resourceId = resourceId;
            resourceLabel.categoryId = item;
            resourceCateList.push(resourceLabel);
          }
          await transactionalEntityManager.save<ResourceCateEntity[]>(resourceCateList);
        }
      }
    });
    return { data: resource };
  }
}
