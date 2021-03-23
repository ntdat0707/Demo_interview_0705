import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LanguageEntity } from '../../entities/language.entity';
import _ = require('lodash');

export async function isLanguageENValid(value: any[], languageRepository: Repository<LanguageEntity>) {
  let checkLanguageEN = false;
  for (const item of value) {
    const language: any = await languageRepository.findOne({ where: { id: item.languageId } });
    if (!language) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'LANGUAGE_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (language.code === 'EN') {
      checkLanguageEN = true;
    }
  }
  if (checkLanguageEN === false) {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'LANGUAGE_ENGLISH_MUST_BE_CREATED',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export async function isDuplicateLanguageValid(value: any[], languageRepository: Repository<LanguageEntity>) {
  const languageIds = [];
  for (const item of value) {
    const language = await languageRepository.findOne({ where: { id: item.languageId } });
    if (!language) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'LANGUAGE_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    languageIds.push(language.code);
  }
  if (hasDuplicates(languageIds)) {
    throw new HttpException(
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'LANGUAGE_HAS_BEEN_DUPLICATE',
      },
      HttpStatus.CONFLICT,
    );
  }
}
function hasDuplicates(arr: any) {
  return _.uniq(arr).length !== arr.length;
}
