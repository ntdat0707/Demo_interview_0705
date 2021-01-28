import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import moment = require('moment');
import { CreateResourceInput } from '../../../resource/resource.dto';
import { EResourceStatus } from '../../constant';

@Injectable()
export class CreateResourcePipe implements PipeTransform<any> {
  transform(value: CreateResourceInput, metadata: ArgumentMetadata) {
    if (!value.title) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'TITLE_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.status) {
      const status: any = value.status;
      if (!Object.values(EResourceStatus).includes(status)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'STATUS_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (value.publishDate && !moment(value.publishDate).isValid()) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'PUBLISHDATE_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
