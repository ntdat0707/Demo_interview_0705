import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { UploadVideoInput } from '../../../video/video.dto';
import { EFlagUploadVideo, EResourceStatus } from '../../constant';

@Injectable()
export class UploadVideoPipe implements PipeTransform<any> {
  transform(value: UploadVideoInput, metadata: ArgumentMetadata) {
    if (!value.title) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'TITLE_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.status) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'STATUS_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
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
    if (!value.flag) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FLAG_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const flag: any = value.flag;
    if (!Object.values(EFlagUploadVideo).includes(flag)) {
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
