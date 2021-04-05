import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { LabelInput } from '../../../label/label.dto';

export class CreateLabelPipe implements PipeTransform<any> {
  transform(value: LabelInput, metadata: ArgumentMetadata) {
    if (!value.name) {
      throw new BadRequestException('NAME_REQUIRED');
    }
    return value;
  }
}
