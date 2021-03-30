import { HttpException, HttpStatus } from '@nestjs/common';
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
  const data: any = {};
  if (total.length < 10) {
    data.isValid = true;
    return data;
  } else {
    data.isValid = false;
    return data;
  }
}

export async function isSolutionAvailable(data: [UpdateSolutionInput], languageRepository: Repository<LanguageEntity>) {
  const solutions = [];

  for (const item of data) {
    if (!item.id) {
      const language = await languageRepository.findOne({ where: { id: item.languageId } });
      if (language.code === 'EN') {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'SOLUTION_LANGUAGE_DUPLICATE',
          },
          HttpStatus.CONFLICT,
        );
      }
    }
    solutions.push(item.languageId);
  }
  if (hasDuplicates(solutions)) {
    throw new HttpException(
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'SOLUTION_LANGUAGE_DUPLICATE',
      },
      HttpStatus.CONFLICT,
    );
  }
}

function hasDuplicates(arr: any) {
  return _.uniq(arr).length !== arr.length;
}
