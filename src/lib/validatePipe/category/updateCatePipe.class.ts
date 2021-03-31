import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { UpdateCategoryInput } from '../../../category/category.dto';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class UpdateCatePipe implements PipeTransform<any> {
  transform(values: [UpdateCategoryInput], metadata: ArgumentMetadata) {
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
    }
    return values;
  }
}
