import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class CheckFilePipe implements PipeTransform<any> {
  transform(file: any, metadata: ArgumentMetadata) {
    if (!file) {
      throw new BadRequestException('FILE_REQUIRED');
    }
    return file;
  }
}
