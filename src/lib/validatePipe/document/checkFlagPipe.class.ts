import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { EDocmentFlag } from '../../constant';

export class CheckFlagPipe implements PipeTransform<any> {
  transform(flag: any, metadata: ArgumentMetadata) {
    if (!flag) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FLAG_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!Object.values(EDocmentFlag).includes(flag)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FLAG_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return flag;
  }
}
