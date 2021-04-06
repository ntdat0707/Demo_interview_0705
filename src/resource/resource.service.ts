import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { Brackets, Connection, getManager, In, Repository } from 'typeorm';
import { AuthorEntity } from '../entities/author.entity';
import { CategoryEntity } from '../entities/category.entity';
import { LabelEntity } from '../entities/label.entity';
import { LanguageEntity } from '../entities/language.entity';
import { ResourceEntity } from '../entities/resource.entity';
import { ResourceAuthorEntity } from '../entities/resourceAuthor.entity';
import { ResourceCateEntity } from '../entities/resourceCate.entity';
import { ResourceLabelEntity } from '../entities/resourceLabel.entity';
import { ECategoryType } from '../lib/constant';
import { convertTv } from '../lib/utils';
import { checkConditionInputCreate, checkConditionInputUpdate } from '../lib/validatePipe/resource/checkCondition';

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
    @InjectRepository(ResourceLabelEntity)
    private resourceLabelEntityRepository: Repository<ResourceLabelEntity>,

    @InjectRepository(CategoryEntity)
    private cateRepository: Repository<CategoryEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
    @InjectRepository(LabelEntity)
    private labelRepository: Repository<LabelEntity>,
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
    private connection: Connection,
  ) {}

  async uploadImage(image: any) {
    this.logger.debug('upload image resource');
    if (!image) {
      throw new BadRequestException('IMAGE_REQUIRED');
    }
    return {
      data: image.filename,
    };
  }

  async createResource(createResources: [CreateResourceInput]) {
    this.logger.debug('Create resource');
    await checkConditionInputCreate(this.resourceRepository, createResources, this.languageRepository);
    const newResources = [];
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existCode = await this.resourceRepository.findOne({ where: { code: randomCode } });
      if (!existCode) {
        break;
      }
    }
    for (const createResource of createResources) {
      let newResource = new ResourceEntity();
      newResource.setAttributes(createResource);
      await this.connection.queryResultCache.clear();
      await getManager().transaction(async transactionalEntityManager => {
        newResource.code = randomCode;
        newResource = await transactionalEntityManager.save<ResourceEntity>(newResource);
        this.logger.debug('Create resource categories');
        if (createResource.categoryIds && createResource.categoryIds.length > 0) {
          const resourceCateList = [];
          for (const item of createResource.categoryIds) {
            //check category
            const category = await this.cateRepository.findOne({
              where: { id: item, languageId: createResource.languageId, type: ECategoryType.POST },
            });
            if (!category) {
              throw new BadRequestException('CATEGORY_NOT_VALID');
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
            throw new NotFoundException('AUTHOR_NOT_FOUND');
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
              throw new NotFoundException(`LABEL_${item}_NOT_FOUND`);
            }
            const resourceLabel = new ResourceLabelEntity();
            resourceLabel.resourceId = newResource.id;
            resourceLabel.labelId = item;
            resourceLabelList.push(resourceLabel);
          }
          await transactionalEntityManager.save<ResourceLabelEntity[]>(resourceLabelList);
        }
        // create imageAttach file
        newResources.push(newResource);
      });
    }
    return { data: newResources };
  }

  async getAllResource(
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    languageId: string,
    status: string,
    searchValue: string,
    filterValue: string,
  ) {
    await this.connection.queryResultCache.clear();
    const resourceQuery = this.resourceRepository
      .createQueryBuilder('resource')
      .where('resource."language_id" =:languageId ', {
        languageId,
      });
    const resourceCount = this.resourceRepository.createQueryBuilder('resource');
    let cacheKey = 'filter_resource';
    const resources: any = resourceQuery
      .leftJoinAndMapOne(
        'resource.author',
        ResourceAuthorEntity,
        'resource_author',
        '"resource_author"."resource_id"="resource".id and resource_author.deleted_at is null',
      )
      .leftJoinAndMapOne(
        'resource_author.authorInf',
        AuthorEntity,
        'author',
        '"author".id="resource_author"."author_id"  ',
      )
      .leftJoinAndMapOne(
        'resource.labels',
        ResourceLabelEntity,
        'resource_label',
        '"resource_label"."resource_id"="resource".id and resource_label.deleted_at is null',
      )
      .leftJoinAndMapMany('resource_label.labelInf', LabelEntity, 'label', '"label".id = "resource_label"."label_id"')
      .leftJoinAndMapMany(
        'resource.categories',
        ResourceCateEntity,
        'resource_category',
        '"resource_category"."resource_id"="resource".id and resource_category.deleted_at is null',
      )
      .leftJoinAndMapOne(
        'resource_label.categoryInf',
        CategoryEntity,
        'category',
        '"category".id = "resource_category"."category_id"',
      )
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy('resource."created_at"', 'DESC');
    if (status) {
      resources.andWhere('resource."status"=:status', { status });
    }
    if (searchValue) {
      searchValue = searchValue.replace(/  +/g, '');
      const titleConvert = convertTv(searchValue.trim());
      const searchTitle = `%${titleConvert}%`;
      cacheKey += `searchValue${searchTitle}`;
      const bracket = new Brackets(qb => {
        qb.andWhere(`LOWER(convertTVkdau("resource"."title")) like '${searchTitle}'`);
      });
      resources.andWhere(bracket);
      resourceCount.andWhere(bracket);
    }
    if (filterValue === 'by_view') {
      resources.addOrderBy('resource."views"', 'DESC');
      resourceCount.addOrderBy('resource."views"', 'DESC');
    }
    let count: any = 0;
    count = await resourceCount.cache(`${cacheKey}_count_page${page}_limit${limit}`).getCount();
    const resourcesOutput = await resources.cache(`${cacheKey}_page${page}_limit${limit}`).getMany();
    // .cache(`resources_page${page}_limit${limit}`)
    //.getMany();

    const pages = Math.ceil(Number(resourceCount) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: count,
      data: resourcesOutput,
    };
  }

  async getResources(code: any, languageId?: string) {
    await this.connection.queryResultCache.clear();
    const resources: any = this.resourceRepository
      .createQueryBuilder('resource')
      .where('"resource".code=:code', { code })
      .leftJoinAndMapOne(
        'resource.author',
        ResourceAuthorEntity,
        'resource_author',
        '"resource_author"."resource_id"="resource".id and resource_author.deleted_at is null',
      )
      .leftJoinAndMapOne(
        'resource_author.authorInf',
        AuthorEntity,
        'author',
        '"author".id="resource_author"."author_id"  ',
      )
      .leftJoinAndMapMany(
        'resource.labels',
        ResourceLabelEntity,
        'resource_label',
        '"resource_label"."resource_id"="resource".id and resource_label.deleted_at is null',
      )
      .leftJoinAndMapOne('resource_label.labelInf', LabelEntity, 'label', '"label".id = "resource_label"."label_id"')
      .leftJoinAndMapMany(
        'resource.categories',
        ResourceCateEntity,
        'resource_category',
        '"resource_category"."resource_id"="resource".id and resource_category.deleted_at is null',
      )
      .leftJoinAndMapOne(
        'resource_label.categoryInf',
        CategoryEntity,
        'category',
        '"category".id = "resource_category"."category_id"',
      );
    if (languageId) {
      resources.andWhere('resource.language_id=:languageId', { languageId });
      const resourceList = await resources.getMany();
      if (resourceList.length > 0) {
        const resource = await this.resourceRepository.findOne({ where: { code: code, languageId: languageId } });
        resource.views += 1;
        await this.resourceRepository.update({ code: code, languageId: languageId }, { views: resource.views });
      }
    }
    return { data: await resources.getMany() };
  }

  async getResourceSEO(link: string, languageId: string) {
    await this.connection.queryResultCache.clear();
    const resource: any = await this.resourceRepository
      .createQueryBuilder('resource')
      .where('"resource".link=:link and "resource".is_edit_seo is TRUE and "resource".language_id =:languageId', {
        link,
        languageId,
      })
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
    return { data: resource };
  }

  async updateResource(code: string, resourcesUpdate: [UpdateResourceInput]) {
    this.logger.debug('Update resource');
    await checkConditionInputUpdate(this.resourceRepository, resourcesUpdate, this.languageRepository);
    const currResources = await this.resourceRepository.find({ where: { code: code } });
    if (currResources.length === 0) {
      throw new NotFoundException(`CODE_${code}_NOT_FOUND`);
    }
    await this.connection.queryResultCache.clear();

    await getManager().transaction(async transactionalEntityManager => {
      for (const resourceUpdate of resourcesUpdate) {
        if (resourceUpdate.id) {
          let currResource: any = new ResourceEntity();
          const index = currResources.findIndex((item: any) => item.id === resourceUpdate.id);
          if (index > -1) {
            currResource = currResources[index];
          }
          //update Author
          this.logger.debug('Update resource author');
          if (!resourceUpdate.authorId) {
            const resourceAuthor = await this.resourceAuthorRepository.findOne({
              where: { resourceId: currResource.id },
            });
            await transactionalEntityManager.softRemove<ResourceAuthorEntity>(resourceAuthor);
          } else {
            const author = await this.authorRepository.findOne({ where: { id: resourceUpdate.authorId } });
            if (!author) {
              throw new NotFoundException(`AUTHOR_${resourceUpdate.authorId}_NOT_FOUND`);
            }
            const resourceAuthor = await this.resourceAuthorRepository.findOne({
              where: { resourceId: currResource.id },
            });
            if (resourceAuthor) {
              resourceAuthor.authorId = resourceUpdate.authorId;
              await transactionalEntityManager.update(
                ResourceAuthorEntity,
                { resourceId: currResource.id },
                { authorId: resourceUpdate.authorId },
              );
            } else {
              const resourceAuthorData = new ResourceAuthorEntity();
              resourceAuthorData.resourceId = currResource.id;
              resourceAuthorData.authorId = resourceUpdate.authorId;
              await transactionalEntityManager.save<ResourceAuthorEntity>(resourceAuthorData);
            }
          }
          //update label
          this.logger.debug('Update resource labels');
          const resourceLabels = await this.resourceLabelEntityRepository.find({
            where: { resourceId: resourceUpdate.id },
          });
          if (resourceLabels.length === 0) {
            const resourceLabelList = [];
            for (const item of resourceUpdate.labelIds) {
              const label = await this.labelRepository.findOne({ where: { id: item } });
              if (!label) {
                throw new NotFoundException(`LABEL_${item}_NOT_FOUND`);
              }
              const resourceLabel = new ResourceLabelEntity();
              resourceLabel.resourceId = resourceUpdate.id;
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
                  throw new NotFoundException(`LABEL_${item}_NOT_FOUND`);
                }
                const resourceLabel = new ResourceLabelEntity();
                resourceLabel.resourceId = resourceUpdate.id;
                resourceLabel.labelId = item;
                resourceLabelList.push(resourceLabel);
              }
              await transactionalEntityManager.save<ResourceLabelEntity[]>(resourceLabelList);
            }
          }
          //update category
          this.logger.debug('Update resource categories');
          const resourceCates = await this.resourceCateRepository.find({
            where: { resourceId: resourceUpdate.id },
          });
          if (resourceCates.length === 0) {
            const resourceCateList = [];
            for (const item of resourceUpdate.categoryIds) {
              const resourceLabel = new ResourceCateEntity();
              resourceLabel.resourceId = resourceUpdate.id;
              resourceLabel.categoryId = item;
              resourceCateList.push(resourceLabel);
            }
            await transactionalEntityManager.save<ResourceCateEntity[]>(resourceCateList);
          } else {
            const currResourceCateIds = resourceCates.map((item: any) => item.categoryId);
            const diffCate = _.difference(currResourceCateIds, resourceUpdate.categoryIds);
            if (diffCate.length > 0) {
              const deleteCates = await this.resourceCateRepository.find({ where: { categoryId: In(diffCate) } });
              await transactionalEntityManager.softRemove<ResourceCateEntity[]>(deleteCates);
            }
            const addCate = _.difference(resourceUpdate.categoryIds, currResourceCateIds);
            if (addCate.length > 0) {
              const resourceCateList = [];
              for (const item of addCate) {
                const category = await this.cateRepository.findOne({
                  where: { id: item, languageId: resourceUpdate.languageId, type: ECategoryType.POST },
                });
                if (!category) {
                  throw new NotFoundException(`CATEGORY_${item}_NOT_VALID`);
                }
                const resourceLabel = new ResourceCateEntity();
                resourceLabel.resourceId = resourceUpdate.id;
                resourceLabel.categoryId = item;
                resourceCateList.push(resourceLabel);
              }
              await transactionalEntityManager.save<ResourceCateEntity[]>(resourceCateList);
            }
          }
          // update images
          this.logger.debug('Update resource have id');
          currResource.setAttributes(resourceUpdate);
          await transactionalEntityManager.update<ResourceEntity>(
            ResourceEntity,
            { id: resourceUpdate.id },
            currResource,
          );
        } else {
          // add new resource
          this.logger.debug('Update resource have no id');
          const newResource = new ResourceEntity();
          newResource.setAttributes(resourceUpdate);
          newResource.code = code;
          await transactionalEntityManager.save<ResourceEntity>(newResource);
          if (resourceUpdate.categoryIds && resourceUpdate.categoryIds.length > 0) {
            const resourceCateList = [];
            for (const item of resourceUpdate.categoryIds) {
              //check category
              const category: any = await this.cateRepository.findOne({ where: { id: item } });
              if (!category) {
                throw new NotFoundException(`CATEGORY_${item}_NOT_FOUND`);
              }
              const resourceCate = new ResourceCateEntity();
              resourceCate.resourceId = newResource.id;
              resourceCate.categoryId = category.id;
              resourceCateList.push(resourceCate);
            }
            await transactionalEntityManager.save<ResourceCateEntity[]>(resourceCateList);
          }
          this.logger.debug('Create resource author');
          if (resourceUpdate.authorId) {
            //check author
            const author = await this.authorRepository.findOne({ where: { id: resourceUpdate.authorId } });
            if (!author) {
              throw new NotFoundException(`AUTHOR_${resourceUpdate.authorId}_NOT_FOUND`);
            }
            const resourceAuthor = new ResourceAuthorEntity();
            resourceAuthor.resourceId = newResource.id;
            resourceAuthor.authorId = resourceUpdate.authorId;
            await this.connection.queryResultCache.clear();
            await transactionalEntityManager.save<ResourceAuthorEntity>(resourceAuthor);
          }
          this.logger.debug('Create resource labels');
          if (resourceUpdate.labelIds && resourceUpdate.labelIds.length > 0) {
            //check label
            const resourceLabelList = [];
            for (const item of resourceUpdate.labelIds) {
              const label = await this.labelRepository.findOne({ where: { id: item } });
              if (!label) {
                throw new NotFoundException(`LABEL_${item}_NOT_FOUND`);
              }
              const resourceLabel = new ResourceLabelEntity();
              resourceLabel.resourceId = newResource.id;
              resourceLabel.labelId = item;
              resourceLabelList.push(resourceLabel);
            }
            await transactionalEntityManager.save<ResourceLabelEntity[]>(resourceLabelList);
          }
        }
      }
    });
    return {};
  }

  async deleteResource(code: string) {
    this.logger.debug('Delete resource');
    const resources = await this.resourceRepository.find({ where: { code: code } });
    if (resources.length === 0) {
      throw new NotFoundException('RESOURCE_NOT_FOUND');
    }
    for (const resource of resources) {
      const resourceAuthor: any = await this.resourceAuthorRepository.findOne({ where: { resourceId: resource.id } });
      const resourceCateList: any = await this.resourceCateRepository.find({ where: { resourceId: resource.id } });
      const resourceLabel: any = await this.resourceLabelEntityRepository.find({ where: { resourceId: resource.id } });
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
      });
    }
  }
}
