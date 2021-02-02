import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { BannerIndexInput } from '../../../banner/banner.dto';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class UpdateIndexBannerPipe implements PipeTransform<any> {
  transform(value: [BannerIndexInput], metadata: ArgumentMetadata) {
    for (const item of value) {
      if (!item.id) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'BANNER_ID_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!checkUUID(item.id)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'BANNER_ID_NOT_VALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!item.index) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'INDEX_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (isNaN(item.index)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'INDEX_NOT_VALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return value;
  }
}
