import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { BannerInput } from '../../../banner/banner.dto';
import { EBannerStatus } from '../../constant';
import { checkDate } from '../../pipeUtils/dateValidate';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class BannerInputPipe implements PipeTransform<any> {
  transform(values: [BannerInput], metadata: ArgumentMetadata) {
    for (const value of values) {
      if (value.id) {
        if (!checkUUID(value.id)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'ID_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (!value.languageId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'LANGUAGE_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (!checkUUID(value.languageId)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'LANGUAGE_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
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
      } else {
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
      if (value.validFrom && !checkDate(value.validFrom)) {
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
    }
    return values;
  }
}
