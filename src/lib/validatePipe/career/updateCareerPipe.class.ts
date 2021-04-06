import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UpdateCareerInput } from '../../../career/career.dto';
import { EEducationLevelStatus, EResourceStatus } from '../../constant';
import { checkDateTime } from '../../pipeUtils/dateValidate';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class UpdateCareerPipe implements PipeTransform<any> {
  transform(values: [UpdateCareerInput], metadata: ArgumentMetadata) {
    for (const value of values) {
      if (!value.title) {
        throw new BadRequestException('TITLE_REQUIRED');
      }
      if (!value.country) {
        throw new BadRequestException('COUNTRY_REQUIRED');
      }
      if (!value.city) {
        throw new BadRequestException('CITY_REQUIRED');
      }
      if (!value.currency) {
        throw new BadRequestException('CURRENCY_REQUIRED');
      }
      if (value.isEditSalary) {
        if (value.isEditSalary !== true && value.isEditSalary !== false)
          throw new BadRequestException('SHOW_SALARY_RANGE_INVALID');
      }
      if (value.minSalary && value.maxSalary) {
        if (value.minSalary > value.maxSalary) {
          throw new BadRequestException('MIN_SALARY_IS_HIGHER_THAN_MAX_SALARY');
        }
      }
      if (!value.jobDescription) {
        throw new BadRequestException('JOB_DESCRIPTION_REQUIRED');
      }
      if (value.status) {
        const status: any = value.status;
        if (!Object.values(EResourceStatus).includes(status)) {
          throw new BadRequestException('STATUS_INVALID');
        }
      }
      if (value.educationLevel) {
        const educationLevel: any = value.educationLevel;
        if (!Object.values(EEducationLevelStatus).includes(educationLevel)) {
          throw new BadRequestException('EDUCATION_LEVEL_INVALID');
        }
      }
      if (value.closingDate && !checkDateTime(value.closingDate)) {
        throw new BadRequestException('CLOSING_DATE_INVALID');
      }
      if (!value.languageId) {
        throw new BadRequestException('LANGUAGE_REQUIRED');
      } else {
        if (!checkUUID(value.languageId)) {
          throw new BadRequestException('LANGUAGE_ID_INVALID');
        }
      }
    }
    return values;
  }
}
