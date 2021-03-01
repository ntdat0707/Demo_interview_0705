import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { CreateCareerInput } from '../../../career/career.dto';
import { ECareerStatus, EEducationLevelStatus } from '../../constant';
import { checkDate } from '../../pipeUtils/dateValidate';

@Injectable()
export class UpdateCareerPipe implements PipeTransform<any> {
  transform(value: CreateCareerInput, metadata: ArgumentMetadata) {
    if (!value.title) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'TITLE_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.country) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'COUNTRY_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.city) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CITY_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.currency) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CURRENCY_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.isEditSalary) {
      if (value.isEditSalary !== true && value.isEditSalary !== false)
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'SHOW_SALARY_RANGE_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
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
    if (!value.jobDescription) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'JOB_DESCRIPTION_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
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
    if (value.closingDate && !checkDate(value.closingDate)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CLOSING_DATE_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
