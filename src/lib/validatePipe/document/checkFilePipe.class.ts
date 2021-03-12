import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';

export class CheckFilePipe implements PipeTransform<any> {
  transform(file: any, metadata: ArgumentMetadata) {
    if (!file) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FILE_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return file;
  }
}
