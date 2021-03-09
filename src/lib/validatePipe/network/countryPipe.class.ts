import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { CountryInput } from '../../../network/network.dto';

export class CountryPipe implements PipeTransform<any> {
  transform(value: CountryInput, metadata: ArgumentMetadata) {
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
