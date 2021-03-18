import { HttpException, HttpStatus } from '@nestjs/common';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { LanguageEntity } from '../../../entities/language.entity';
import { ResourceEntity } from '../../../entities/resource.entity';
import { CreateResourceInput, UpdateResourceInput } from '../../../resource/resource.dto';

export async function checkConditionInputCreate(
  resourceRepository: Repository<ResourceEntity>,
  createResource: [CreateResourceInput],
  languageRepository: Repository<LanguageEntity>,
) {
  const resources = [];
  let checkLanguageEN = false;
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
    const language: any = await languageRepository.findOne({ where: { id: resource.languageId } });
    if (language.code === 'EN') {
      checkLanguageEN = true;
    }
    resources.push(language.id);
  }
  if (checkLanguageEN === false) {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'RESOURCE_ENGLISH_MUST_BE_CREATED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  if (hasDuplicates(resources)) {
    throw new HttpException(
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'LANGUAGE_CREATE_HAS_BEEN_DUPLICATE',
      },
      HttpStatus.CONFLICT,
    );
  }
}

export async function checkConditionInputUpdate(
  resourceRepository: Repository<ResourceEntity>,
  updateResource: [UpdateResourceInput],
  languageRepository: Repository<LanguageEntity>,
) {
  const resources = [];
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
    const language: any = await languageRepository.findOne({ where: { id: resource.languageId } });
    resources.push(language.id);
  }
  if (hasDuplicates(resources)) {
    throw new HttpException(
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'LANGUAGE_CREATE_HAS_BEEN_DUPLICATE',
      },
      HttpStatus.CONFLICT,
    );
  }
}
function hasDuplicates(arr: any) {
  return _.uniq(arr).length !== arr.length;
}
