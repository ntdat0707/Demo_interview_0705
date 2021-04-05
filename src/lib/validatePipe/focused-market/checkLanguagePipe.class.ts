import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class CheckLanguagePipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && !checkUUID(value)) {
      throw new BadRequestException('LANGUAGE_INVALID');
    }
    return value;
  }
}
