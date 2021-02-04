import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { UpdateVideoInput } from '../../../video/video.dto';
import { EResourceStatus } from '../../constant';

@Injectable()
export class UpdateVideoPipe implements PipeTransform<any> {
  transform(value: UpdateVideoInput, metadata: ArgumentMetadata) {
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
    return value;
  }
}
