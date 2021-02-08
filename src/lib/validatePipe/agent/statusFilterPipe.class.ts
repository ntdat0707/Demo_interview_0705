import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { EBannerStatus } from '../../constant';

@Injectable()
export class CheckStatusFilterPipe implements PipeTransform<any> {
  transform(values: string[], metadata: ArgumentMetadata) {
    for (const item of values) {
      const status: any = item;
      if (!Object.values(EBannerStatus).includes(status)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'STATUS_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return values;
  }
}
