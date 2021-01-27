import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import moment = require('moment');
import { BannerInput } from '../../../banner/banner.dto';
import { EBannerStatus } from '../../constant';
import { checkDate } from '../../pipeUtils/dateValidate';

@Injectable()
export class CreateBannerPipe implements PipeTransform<any> {
  transform(value: BannerInput, metadata: ArgumentMetadata) {
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
    if (value.validFrom && !moment(value.validFrom, 'YYYY-MM-DD', true).isValid()) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'VALIDFROM_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.validTo && !checkDate(value.validTo)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'VALIDTO_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
