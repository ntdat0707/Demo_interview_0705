import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { UpdateSolutionInput } from '../../../solution/solution.dto';
import { EResourceStatus } from '../../constant';
import { checkDateTime } from '../../pipeUtils/dateValidate';

@Injectable()
export class UpdateSolutionPipe implements PipeTransform<any> {
  transform(value: [UpdateSolutionInput], metadata: ArgumentMetadata) {
    for (const item of value) {
      if (!item.title) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'TITLE_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (item.status) {
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
      if (!item.languageId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'LANGUAGE_REQUIRED',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (item.publishDate && !checkDateTime(item.publishDate)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'PUBLISHDATE_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return value;
  }
}
