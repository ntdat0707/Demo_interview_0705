import { PipeTransform, HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { checkUUID } from '../pipeUtils/uuidValidate';

@Injectable()
export class CheckUUID implements PipeTransform<any> {
  async transform(value: string): Promise<string> {
    if (value && !checkUUID(value)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'ID_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
