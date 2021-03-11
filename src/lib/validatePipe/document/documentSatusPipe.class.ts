import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { DocumentUpdateStatus } from '../../../document/document.dto';
import { EResourceStatus } from '../../constant';

export class DocumentStatusPipe implements PipeTransform<any> {
  transform(value: DocumentUpdateStatus, metadata: ArgumentMetadata) {
    if (!value.status) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          meassage: 'STATUS_REQUIRED',
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
