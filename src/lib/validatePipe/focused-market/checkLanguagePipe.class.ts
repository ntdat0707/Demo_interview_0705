import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class CheckLanguagePipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && !checkUUID(value)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'lANGUAGE_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
