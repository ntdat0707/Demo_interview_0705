import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { CreateCategoryInput } from '../../../category/category.dto';
import { ECategoryType, EResourceStatus } from '../../constant';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class CreateCatePipe implements PipeTransform<any> {
  transform(values: [CreateCategoryInput], metadata: ArgumentMetadata) {
    for (const value of values) {
      if (!value.title) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'TITLE_REQUIRED',
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
      if (!value.link) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'URL_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!value.type) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'TYPE_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (!(Object.values(ECategoryType) as any[]).includes(value.type)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'TYPE__INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    return values;
  }
}

export class StatusCatePipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'STATUS_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!(Object.values(EResourceStatus) as any[]).includes(value)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'STATUS__INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
