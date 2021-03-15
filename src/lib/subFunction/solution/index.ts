import _ = require('lodash');
import { Repository } from 'typeorm';
import { LanguageEntity } from '../../../entities/language.entity';
import { SolutionEntity } from '../../../entities/solution.entity';
import { UpdateSolutionInput } from '../../../solution/solution.dto';

export async function countSolution(solutionRepository: Repository<SolutionEntity>, languageId: string) {
  const [solutions, total] = await solutionRepository.findAndCount({ where: { languageId: languageId } });
  const data: any = {};
  if (total < 10) {
    data.solutions = solutions;
    data.isValid = true;
    return data;
  } else {
    data.solutions = solutions;
    data.isValid = false;
    return data;
  }
}

export async function isSolutionAvailable(data: [UpdateSolutionInput], languageRepository: Repository<LanguageEntity>) {
  const solutions = [];
  let checkDuplicates = false;

  for (const item of data) {
    solutions.push(item.languageId);
  }
  if (hasDuplicates(solutions)) {
    checkDuplicates = true;
  } else {
    checkDuplicates = false;
  }
  return checkDuplicates;
}

function hasDuplicates(arr: any) {
  return _.uniq(arr).length !== arr.length;
}
