import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { CreateResourceInput } from '../../../resource/resource.dto';
import { EResourceStatus } from '../../constant';
import { checkDateTime } from '../../pipeUtils/dateValidate';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class CreateResourcePipe implements PipeTransform<any> {
  transform(value: CreateResourceInput, metadata: ArgumentMetadata) {
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
    if (value.publishDate && !checkDateTime(value.publishDate)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'PUBLISHDATE_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.categoryIds) {
      for (const item of value.categoryIds) {
        if (!checkUUID(item)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'CATEGORY_UUID_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    if (value.authorId) {
      if (!checkUUID(value.authorId)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'AUTHOR_UUID_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (value.labelIds) {
      for (const item of value.labelIds) {
        if (!checkUUID(item)) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'LABEL_UUID_INVALID',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    return value;
  }
}
