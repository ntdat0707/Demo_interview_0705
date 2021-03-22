import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { BannerIndexInput } from '../../../banner/banner.dto';

@Injectable()
export class UpdateIndexBannerPipe implements PipeTransform<any> {
  transform(value: [BannerIndexInput], metadata: ArgumentMetadata) {
    for (const item of value) {
      if (!item.code) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'CODE_REQUIRED',
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
