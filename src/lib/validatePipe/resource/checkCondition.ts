import { HttpException, HttpStatus } from '@nestjs/common';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { LanguageEntity } from '../../../entities/language.entity';
import { ResourceEntity } from '../../../entities/resource.entity';
import { CreateResourceInput, UpdateResourceInput } from '../../../resource/resource.dto';
import { isDuplicateLanguageValid, isLanguageENValid } from '../../pipeUtils/languageValidate';

export async function checkConditionInputCreate(
  resourceRepository: Repository<ResourceEntity>,
  createResource: [CreateResourceInput],
  languageRepository: Repository<LanguageEntity>,
) {
  await isLanguageENValid(createResource, languageRepository);
  await isDuplicateLanguageValid(createResource, languageRepository);
  const links = [];
  for (const resource of createResource) {
    const existPost = await resourceRepository
      .createQueryBuilder('resource')
      .where(`title ilike :title`, { title: `%"${resource.title}"%` })
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
    if (resource.isEditSEO === true) {
      links.push(resource.link);
      const url = await resourceRepository.findOne({
        where: { isEditSEO: true, link: resource.link },
      });
      if (url) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'SEO_URL_IS_EXISTED',
          },
          HttpStatus.CONFLICT,
        );
      }
    }
    if (hasDuplicates(links)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'LINKS_HAS_BEEN_DUPLICATE',
        },
        HttpStatus.CONFLICT,
      );
    }
  }
}

export async function checkConditionInputUpdate(
  resourceRepository: Repository<ResourceEntity>,
  updateResource: [UpdateResourceInput],
  languageRepository: Repository<LanguageEntity>,
) {
  await isDuplicateLanguageValid(updateResource, languageRepository);
  const links = [];
  for (const resource of updateResource) {
    const existPost = await resourceRepository
      .createQueryBuilder('resource')
      .where(`title ilike :title`, { title: `%"${resource.title}"%` })
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
    if (resource.isEditSEO === true && !resource.id) {
      links.push(resource.link);
      const url = await resourceRepository.findOne({ where: { isEditSEO: true, link: resource.link } });
      if (url) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'SEO_URL_IS_EXISTED',
          },
          HttpStatus.CONFLICT,
        );
      }
    }
    if (hasDuplicates(links)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'LINKS_HAS_BEEN_DUPLICATE',
        },
        HttpStatus.CONFLICT,
      );
    }
  }
}
function hasDuplicates(arr: any) {
  return _.uniq(arr).length !== arr.length;
}
