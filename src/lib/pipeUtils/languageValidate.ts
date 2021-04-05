import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LanguageEntity } from '../../entities/language.entity';
import _ = require('lodash');

export async function isLanguageENValid(value: any[], languageRepository: Repository<LanguageEntity>) {
  let checkLanguageEN = false;
  for (const item of value) {
    const language: any = await languageRepository.findOne({ where: { id: item.languageId } });
    if (!language) {
      throw new NotFoundException('LANGUAGE_NOT_FOUND');
    }
    if (language.code === 'EN') {
      checkLanguageEN = true;
    }
  }
  if (checkLanguageEN === false) {
    throw new BadRequestException('LANGUAGE_ENGLISH_MUST_BE_CREATED');
  }
}

export async function isDuplicateLanguageValid(value: any[], languageRepository: Repository<LanguageEntity>) {
  const languageIds = [];
  for (const item of value) {
    const language = await languageRepository.findOne({ where: { id: item.languageId } });
    if (!language) {
      throw new NotFoundException('LANGUAGE_NOT_FOUND');
    }
    languageIds.push(language.code);
  }
  if (hasDuplicates(languageIds)) {
    throw new BadRequestException('DUPLICATE_LANGUAGE');
  }
}
function hasDuplicates(arr: any) {
  return _.uniq(arr).length !== arr.length;
}

export async function isThreeLanguageValid(values: any[], languageRepository: Repository<LanguageEntity>) {
  const languageIdsInput = values.map((item: any) => item.languageId);
  const languages = (await languageRepository.find({})).map((language: any) => language.id);
  const diff = _.difference(languages, languageIdsInput);
  if (diff.length > 0) {
    throw new BadRequestException('CATEGORY_MUST_HAVE_THREE_LANGUAGES');
  }
}
