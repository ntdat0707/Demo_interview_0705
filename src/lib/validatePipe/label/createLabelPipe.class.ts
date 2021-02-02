import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { LabelInput } from '../../../label/label.dto';

export class CreateLabelPipe implements PipeTransform<any> {
  transform(value: LabelInput, metadata: ArgumentMetadata) {
    if (!value.name) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'NAME_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
