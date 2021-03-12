import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Connection, getManager, In, Repository } from 'typeorm';
import { AuthorEntity } from '../entities/author.entity';
import { CategoryEntity } from '../entities/category.entity';
import { LabelEntity } from '../entities/label.entity';
import { ResourceEntity } from '../entities/resource.entity';
import { ResourceAuthorEntity } from '../entities/resourceAuthor.entity';
import { ResourceCateEntity } from '../entities/resourceCate.entity';
import { ResourceImageEntity } from '../entities/resourceImage.entity';
import { ResourceLabelEntity } from '../entities/resourceLabel.entity';
import { mapDataResource } from '../lib/mapData/resource';

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

    @InjectRepository(CategoryEntity)
    private cateRepository: Repository<CategoryEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
    @InjectRepository(LabelEntity)
    private labelRepository: Repository<LabelEntity>,

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
      data: image.filename,
    };
  }

  async createResource(createResource: CreateResourceInput) {
    this.logger.debug('Create resource');
    const existPost = await this.resourceRepository
      .createQueryBuilder('resource')
      .where(`title ilike :title`, { title: `%"${createResource.title}"%` })
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
      this.logger.debug('Create resource categories');
      if (createResource.categoryIds && createResource.categoryIds.length > 0) {
        const resourceCateList = [];
        for (const item of createResource.categoryIds) {
          //check category
          const category = await this.cateRepository.findOne({ where: { id: item } });
          if (!category) {
            throw new HttpException(
              {
                statusCode: HttpStatus.NOT_FOUND,
                message: `CATEGORY_${item}_NOT_FOUND`,
              },
              HttpStatus.NOT_FOUND,
            );
          }
          const resourceCate = new ResourceCateEntity();
          resourceCate.resourceId = newResource.id;
          resourceCate.categoryId = item;
          resourceCateList.push(resourceCate);
        }
        await transactionalEntityManager.save<ResourceCateEntity[]>(resourceCateList);
      }
      this.logger.debug('Create resource author');
      if (createResource.authorId) {
        //check author
        const author = await this.authorRepository.findOne({ where: { id: createResource.authorId } });
        if (!author) {
          throw new HttpException(
            {
              statusCode: HttpStatus.NOT_FOUND,
              message: `AUTHOR_${createResource.authorId}_NOT_FOUND`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
        const resourceAuthor = new ResourceAuthorEntity();
        resourceAuthor.resourceId = newResource.id;
        resourceAuthor.authorId = createResource.authorId;
        await this.connection.queryResultCache.clear();
        await transactionalEntityManager.save<ResourceAuthorEntity>(resourceAuthor);
      }
      this.logger.debug('Create resource labels');
      if (createResource.labelIds && createResource.labelIds.length > 0) {
        //check label
        const resourceLabelList = [];
        for (const item of createResource.labelIds) {
          const label = await this.labelRepository.findOne({ where: { id: item } });
          if (!label) {
            throw new HttpException(
              {
                statusCode: HttpStatus.NOT_FOUND,
                message: `LABEL_${item}_NOT_FOUND`,
              },
              HttpStatus.NOT_FOUND,
            );
          }
          const resourceLabel = new ResourceLabelEntity();
          resourceLabel.resourceId = newResource.id;
          resourceLabel.labelId = item;
          resourceLabelList.push(resourceLabel);
        }
        await transactionalEntityManager.save<ResourceLabelEntity[]>(resourceLabelList);
      }
      // create imageAttach file
      this.logger.debug('Create resource Images');
      if ((createResource.images && createResource.images.length > 0) || createResource.avatar) {
        if (createResource.images && createResource.images.length > 0) {
          const resourceImageList = [];
          for (const item of createResource.images) {
            const resourceImage: any = new ResourceImageEntity();
            resourceImage.image = item.image;
            resourceImage.resourceId = newResource.id;
            resourceImageList.push(resourceImage);
          }
          await transactionalEntityManager.save<ResourceImageEntity[]>(resourceImageList);
        }
        if (createResource.avatar) {
          const resourceImage: any = new ResourceImageEntity();
          resourceImage.image = createResource.avatar;
          resourceImage.resourceId = newResource.id;
          resourceImage.alt = createResource.alt ? createResource.alt : '';
          resourceImage.isAvatar = true;
          await transactionalEntityManager.save<ResourceImageEntity>(resourceImage);
        }
      }
    });
    return { data: newResource };
  }

  async getAllResource(page = 1, limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10)) {
    const resourceQuery = this.resourceRepository.createQueryBuilder('resource');
    const resourceCount = await resourceQuery.cache(`resources_count_page${page}_limit${limit}`).getCount();
    const resources: any = await resourceQuery
      .leftJoinAndMapMany(
        'resource.images',
        ResourceImageEntity,
        'resource_image',
        '"resource_image"."resource_id"="resource".id',
      )
      .leftJoinAndMapMany(
        'resource.authors',
        ResourceAuthorEntity,
        'resource_author',
        '"resource_author"."resource_id"="resource".id',
      )
      .leftJoinAndMapOne('author', AuthorEntity, 'author', '"author".id="resource_author"."author_id"')
      .leftJoinAndMapOne(
        'resource.labels',
        ResourceLabelEntity,
        'resource_label',
        '"resource_label"."resource_id"="resource".id',
      )
      .leftJoinAndMapMany('labels', LabelEntity, 'label', '"label".id = "resource_label"."label_id"')
      .leftJoinAndMapMany(
        'resource.categories',
        ResourceCateEntity,
        'resource_category',
        '"resource_category"."resource_id"="resource".id',
      )
      .leftJoinAndMapMany('categories', CategoryEntity, 'category', '"category".id = "resource_category"."category_id"')
      .where('resource."deleted_at" is null')
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('resource."created_at"', 'DESC')
      .cache(`resources_page${page}_limit${limit}`)
      .getMany();

    const pages = Math.ceil(Number(resourceCount) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: resourceCount,
      data: mapDataResource(resources, true),
    };
  }

  async getResource(resourceId: any) {
    const resource: any = await this.resourceRepository
      .createQueryBuilder('resource')
      .where('"resource".id=:resourceId', { resourceId })
      .leftJoinAndMapMany(
        'resource.images',
        ResourceImageEntity,
        'resource_image',
        '"resource_image"."resource_id"="resource".id and resource_image.deleted_at is null',
      )
      .leftJoinAndMapOne(
        'resource.author',
        ResourceAuthorEntity,
        'resource_author',
        '"resource_author"."resource_id"="resource".id and resource_author.deleted_at is null',
      )
      .leftJoinAndMapOne('authors', AuthorEntity, 'author', '"author".id="resource_author"."author_id" ')
      .leftJoinAndMapMany(
        'resource.labels',
        ResourceLabelEntity,
        'resource_label',
        '"resource_label"."resource_id"="resource".id and resource_label.deleted_at is null',
      )
      .leftJoinAndMapMany('labels', LabelEntity, 'label', '"label".id = "resource_label"."label_id"')
      .leftJoinAndMapMany(
        'resource.categories',
        ResourceCateEntity,
        'resource_category',
        '"resource_category"."resource_id"="resource".id and resource_category.deleted_at is null',
      )
      .leftJoinAndMapMany('categories', CategoryEntity, 'category', '"category".id = "resource_category"."category_id"')
      .getOne();
    return { data: mapDataResource(resource, false) };
  }

  async updateResource(resourceId: string, resourceUpdate: UpdateResourceInput) {
    this.logger.debug('Update resource');
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
      this.logger.debug('Update resource data');
      resource = await transactionalEntityManager.save<ResourceEntity>(resource);

      //update Author
      this.logger.debug('Update resource author');
      await this.connection.queryResultCache.clear();
      if (!resourceUpdate.authorId) {
        const resourceAuthor = await this.resourceAuthorRepository.findOne({ where: { resourceId: resourceId } });
        await transactionalEntityManager.softRemove<ResourceAuthorEntity>(resourceAuthor);
      } else {
        const author = await this.authorRepository.findOne({ where: { id: resourceUpdate.authorId } });
        if (!author) {
          throw new HttpException(
            {
              statusCode: HttpStatus.NOT_FOUND,
              message: `AUTHOR_${resourceUpdate.authorId}_NOT_FOUND`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
        const resourceAuthor = await this.resourceAuthorRepository.findOne({ where: { resourceId: resourceId } });
        if (resourceAuthor) {
          resourceAuthor.authorId = resourceUpdate.authorId;
          await transactionalEntityManager.update(
            ResourceAuthorEntity,
            { resourceId: resourceId },
            { authorId: resourceUpdate.authorId },
          );
        } else {
          const resourceAuthorData = new ResourceAuthorEntity();
          resourceAuthorData.resourceId = resourceId;
          resourceAuthorData.authorId = resourceUpdate.authorId;
          await transactionalEntityManager.save<ResourceAuthorEntity>(resourceAuthorData);
        }
      }

      //update label
      this.logger.debug('Update resource labels');
      const resourceLabels = await this.resourceLabelEntityRepository.find({ where: { resourceId: resourceId } });
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
        const diff = _.difference(currResourceLabelIds, resourceUpdate.labelIds);
        if (diff.length > 0) {
          const deleteResources = await this.resourceLabelEntityRepository.find({ where: { labelId: In(diff) } });
          await transactionalEntityManager.softRemove<ResourceLabelEntity[]>(deleteResources);
        }
        const add = _.difference(resourceUpdate.labelIds, currResourceLabelIds);
        if (add.length > 0) {
          const resourceLabelList = [];
          for (const item of add) {
            const label = await this.labelRepository.findOne({ where: { id: item } });
            if (!label) {
              throw new HttpException(
                {
                  statusCode: HttpStatus.NOT_FOUND,
                  message: `LABEL_${item}_NOT_FOUND`,
                },
                HttpStatus.NOT_FOUND,
              );
            }
            const resourceLabel = new ResourceLabelEntity();
            resourceLabel.resourceId = resourceId;
            resourceLabel.labelId = item;
            resourceLabelList.push(resourceLabel);
          }
          await transactionalEntityManager.save<ResourceLabelEntity[]>(resourceLabelList);
        }
      }

      //update category
      this.logger.debug('Update resource categories');
      const resourceCates = await this.resourceCateRepository.find({ where: { resourceId: resourceId } });
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
        const diff = _.difference(currResourceCateIds, resourceUpdate.categoryIds);
        if (diff.length > 0) {
          const deleteCates = await this.resourceCateRepository.find({ where: { categoryId: In(diff) } });
          await transactionalEntityManager.softRemove<ResourceCateEntity[]>(deleteCates);
        }
        const add = _.difference(resourceUpdate.categoryIds, currResourceCateIds);
        if (add.length > 0) {
          const resourceCateList = [];
          for (const item of add) {
            const category = await this.cateRepository.findOne({ where: { id: item } });
            if (!category) {
              throw new HttpException(
                {
                  statusCode: HttpStatus.NOT_FOUND,
                  message: `CATEGORY_${item}_NOT_FOUND`,
                },
                HttpStatus.NOT_FOUND,
              );
            }
            const resourceLabel = new ResourceCateEntity();
            resourceLabel.resourceId = resourceId;
            resourceLabel.categoryId = item;
            resourceCateList.push(resourceLabel);
          }
          await transactionalEntityManager.save<ResourceCateEntity[]>(resourceCateList);
        }
      }
      // update images
      this.logger.debug('Update resource images');

      if (resourceUpdate.images && resourceUpdate.images.length > 0) {
        const newPictures = [];
        const updatePictures = [];
        for (const image of resourceUpdate.images) {
          if (!image) {
            const resourcePictureData: any = new ResourceImageEntity();
            resourcePictureData.image = image.image;
            resourcePictureData.resourceId = resourceId;
            resourcePictureData.isAvatar = false;
            newPictures.push(resourcePictureData);
          } else {
            updatePictures.push(image);
          }
        }
        const deleteImages = await this.resourceImageRepository.find({
          where: { resourceId: resourceId, isAvatar: false },
        });
        if (deleteImages.length > 0 && updatePictures.length > 0) {
          await transactionalEntityManager.softRemove<ResourceImageEntity>(deleteImages);
        }

        await transactionalEntityManager.save<ResourceImageEntity[]>(newPictures);
      } else if (!resourceUpdate.images) {
        const deleteImages = await this.resourceImageRepository.find({
          where: { resourceId: resourceId, isAvatar: false },
        });
        if (deleteImages) await transactionalEntityManager.softRemove<ResourceImageEntity>(deleteImages);
      }
      if (resourceUpdate.avatar) {
        const resourcePictureData: any = new ResourceImageEntity();
        resourcePictureData.image = resourceUpdate.avatar;
        resourcePictureData.resourceId = resourceId;
        resourcePictureData.isAvatar = true;
        const deleteAvatar = await this.resourceImageRepository.find({
          where: { resourceId: resourceId, isAvatar: true },
        });
        await transactionalEntityManager.softRemove<ResourceImageEntity>(deleteAvatar);
        await transactionalEntityManager.save<ResourceImageEntity>(resourcePictureData);
      } else {
        const deleteAvatar = await this.resourceImageRepository.find({
          where: { resourceId: resourceId, isAvatar: true },
        });
        if (deleteAvatar) await transactionalEntityManager.softRemove<ResourceImageEntity>(deleteAvatar);
      }
    });
    const resourceUpdated = await this.resourceRepository
      .createQueryBuilder('resource')
      .where('"resource".id=:resourceId', { resourceId })
      .leftJoinAndMapMany(
        'resource.images',
        ResourceImageEntity,
        'resource_image',
        '"resource_image"."resource_id"="resource".id',
      )
      .leftJoinAndMapOne(
        'resource.authors',
        ResourceAuthorEntity,
        'resource_author',
        '"resource_author"."resource_id"="resource".id',
      )
      .leftJoinAndMapOne('authors', AuthorEntity, 'author', '"author".id="resource_author"."author_id"')
      .leftJoinAndMapMany(
        'resource.labels',
        ResourceLabelEntity,
        'resource_label',
        '"resource_label"."resource_id"="resource".id',
      )
      .leftJoinAndMapMany('labels', LabelEntity, 'label', '"label".id = "resource_label"."label_id"')
      .leftJoinAndMapMany(
        'resource.categories',
        ResourceCateEntity,
        'resource_category',
        '"resource_category"."resource_id"="resource".id',
      )
      .leftJoinAndMapMany('categories', CategoryEntity, 'category', '"category".id = "resource_category"."category_id"')
      .getOne();
    return { data: mapDataResource(resourceUpdated, false) };
  }

  async deleteResource(resourceId: string) {
    this.logger.debug('Delete resource');
    const resource: any = await this.resourceRepository.findOne({ where: { id: resourceId } });
    if (!resource) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'RESOURCE_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const resourceAuthor: any = await this.resourceAuthorRepository.findOne({ where: { resourceId: resourceId } });
    const resourceCateList: any = await this.resourceCateRepository.find({ where: { resourceId: resourceId } });
    const resourceLabel: any = await this.resourceLabelEntityRepository.find({ where: { resourceId: resourceId } });
    const resourceImages: any = await this.resourceImageRepository.find({ where: { resourceId: resourceId } });
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.softDelete(ResourceEntity, resource);
      if (resourceAuthor) {
        await transactionalEntityManager.softRemove(ResourceAuthorEntity, resourceAuthor);
      }
      if (resourceCateList.length > 0) {
        await transactionalEntityManager.softRemove(ResourceCateEntity, resourceCateList);
      }
      if (resourceLabel.length > 0) {
        await transactionalEntityManager.softRemove(ResourceLabelEntity, resourceLabel);
      }
      if (resourceImages.length > 0) {
        await transactionalEntityManager.softRemove(ResourceImageEntity, resourceImages);
      }
    });
  }
}
