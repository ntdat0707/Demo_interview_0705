import { HttpException, HttpStatus } from '@nestjs/common';
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
      const url = await resourceRepository.findOne({
        where: { isEditSEO: true, link: resource.link, languageId: resource.languageId },
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
  }
}

export async function checkConditionInputUpdate(
  resourceRepository: Repository<ResourceEntity>,
  updateResource: [UpdateResourceInput],
  languageRepository: Repository<LanguageEntity>,
) {
  await isDuplicateLanguageValid(updateResource, languageRepository);
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
      const url = await resourceRepository.findOne({
        where: { isEditSEO: true, link: resource.link, languageId: resource.languageId },
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
  }
}
