import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { EResourceStatus } from '../constant';

export class CheckStatusPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value) {
      if (value !== EResourceStatus.PUBLISH) {
        throw new BadRequestException('STATUS_INVALID');
      }
    }
    return value;
  }
}
