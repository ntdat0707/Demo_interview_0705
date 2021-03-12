import { Repository } from 'typeorm';
import { SolutionEntity } from '../../../entities/solution.entity';

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
