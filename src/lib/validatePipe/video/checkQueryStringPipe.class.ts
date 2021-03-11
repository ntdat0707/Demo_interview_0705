import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { EDocmentFlag } from '../../constant';

@Injectable()
export class CheckFlagPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!Object.values(EDocmentFlag).includes(value)) {
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
