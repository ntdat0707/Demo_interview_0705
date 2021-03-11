import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { DocumentInput } from '../../../document/document.dto';
import { EDocmentFlag, EResourceStatus } from '../../constant';

export class DocumentPipe implements PipeTransform<any> {
  transform(value: DocumentInput, metadata: ArgumentMetadata) {
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
    // if (!value.file) {
    //   throw new HttpException(
    //     {
    //       statusCode: HttpStatus.BAD_REQUEST,
    //       message: 'FILE_REQUIRED',
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    if (!value.flag) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FLAG_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const flag: any = value.flag;
      if (!Object.values(EDocmentFlag).includes(flag)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'FLAG_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return value;
  }
}
