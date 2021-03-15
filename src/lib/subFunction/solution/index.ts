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

// export async function isSolutionAvailable(data: [UpdateSolutionInput], languageRepository: Repository<LanguageEntity>) {
//   let checkLanguages: any = data.map((item: any) => {
//     item.languageId;
//   });

//   let totalLanguage = { languageVN: 0, languageEN: 0, languageCN: 0 };
//   for (let item of checkLanguages) {
//     let language = await languageRepository.findOne({ where: { id: item } });
//     if (language.code === 'VN') {
//       totalLanguage.languageVN++;
//     }
//     if (language.code === 'EN') {
//       totalLanguage.languageEN++;
//     }
//     if (language.code === 'CN') {
//       totalLanguage.languageCN++;
//     }
//   }
//   return totalLanguage;
// }
