import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { CategoryInput } from '../../../category/category.dto';

export class CreateCatePipe implements PipeTransform<any> {
  transform(values: [CategoryInput], metadata: ArgumentMetadata) {
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
    }
    return values;
  }
}
