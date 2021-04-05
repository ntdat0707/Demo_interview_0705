import { BadRequestException, ConflictException } from '@nestjs/common';
import _ = require('lodash');
import { Repository } from 'typeorm';
import { LanguageEntity } from '../../../entities/language.entity';
import { SolutionEntity } from '../../../entities/solution.entity';
import { UpdateSolutionInput } from '../../../solution/solution.dto';

export async function countSolution(solutionRepository: Repository<SolutionEntity>) {
  const total = await solutionRepository
    .createQueryBuilder('solution')
    .select('DISTINCT solution."code"')
    .getRawMany();
  if (total.length < 10) {
    return false;
  } else {
    return true;
  }
}

export async function isSolutionAvailable(data: [UpdateSolutionInput], languageRepository: Repository<LanguageEntity>) {
  const solutions = [];
  for (const item of data) {
    if (!item.id) {
      const language = await languageRepository.findOne({ where: { id: item.languageId } });
      if (language.code !== 'EN') {
        throw new BadRequestException('LANGUAGE_ENGLISH_MUST_BE_CREATED');
      }
    }
    solutions.push(item.languageId);
  }
  if (hasDuplicates(solutions)) {
    throw new ConflictException('SOLUTION_LANGUAGE_DUPLICATE');
  }
}

function hasDuplicates(arr: any) {
  return _.uniq(arr).length !== arr.length;
}
