import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { FocusedMarketInput } from '../../../focused-market/focused-market.dto';
import { EResourceStatus } from '../../constant';
import { checkDateTime } from '../../pipeUtils/dateValidate';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class FocusedMarketPipe implements PipeTransform<any> {
  transform(value: [FocusedMarketInput], metadata: ArgumentMetadata) {
    for (const item of value) {
      if (!item.languageId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'LANGUAGE_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!checkUUID(item.languageId)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'LANGUAGE_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!item.title) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'TITLE_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!item.status) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'STATUS_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const status: any = item.status;
        if (!Object.values(EResourceStatus).includes(status)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'STATUS_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (!item.isPublish) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'IS_PUBLISH_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (item.publishDate) {
        if (!checkDateTime(item.publishDate)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'PUBLISH_DATE_REQUIRED',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    return value;
  }
}
