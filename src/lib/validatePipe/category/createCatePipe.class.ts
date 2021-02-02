import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { CategoryInput } from '../../../category/category.dto';

export class CreateCatePipe implements PipeTransform<any> {
  transform(value: CategoryInput, metadata: ArgumentMetadata) {
    if (!value.name) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'NAME_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
