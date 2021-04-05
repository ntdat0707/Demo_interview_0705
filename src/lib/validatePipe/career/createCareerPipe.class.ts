import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateCareerInput } from '../../../career/career.dto';
import { ECareerStatus, EEducationLevelStatus } from '../../constant';
import { checkDate } from '../../pipeUtils/dateValidate';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class CreateCareerPipe implements PipeTransform<any> {
  transform(values: [CreateCareerInput], metadata: ArgumentMetadata) {
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

      if (!value.jobDescription) {
        throw new BadRequestException('JOB_EDUCATION_REQUIRED');
      }
      if (value.status) {
        const status: any = value.status;
        if (!Object.values(ECareerStatus).includes(status)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'STATUS_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (value.educationLevel) {
        const educationLevel: any = value.educationLevel;
        if (!Object.values(EEducationLevelStatus).includes(educationLevel)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'EDUCATION_LEVEL_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (value.minSalary && value.maxSalary) {
        if (value.minSalary > value.maxSalary) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'MIN_SALARY_IS_HIGHER_THAN_MAX_SALARY',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (value.closingDate && !checkDate(value.closingDate)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'CLOSING_DATE_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!value.languageId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'LANGUAGE_IS_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (!checkUUID(value.languageId)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'LANGUAGE_ID_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    return values;
  }
}
