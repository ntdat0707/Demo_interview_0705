import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { EFlagUploadVideo } from '../../constant';

@Injectable()
export class CheckFlagPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FLAG_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!Object.values(EFlagUploadVideo).includes(value)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FLAG_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
