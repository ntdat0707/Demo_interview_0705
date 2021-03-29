import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { UpdateCategoryInput } from '../../../category/category.dto';
import { ECategoryType, EResourceStatus } from '../../constant';

export class UpdateCatePipe implements PipeTransform<any> {
  transform(values: [UpdateCategoryInput], metadata: ArgumentMetadata) {
    for (const value of values) {
      if (!value.code) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'CODE_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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
            message: 'LANGUAGE_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
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
      if (!value.status) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'STATUS_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (!(Object.values(EResourceStatus) as any[]).includes(value.status)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'STATUS_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
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
