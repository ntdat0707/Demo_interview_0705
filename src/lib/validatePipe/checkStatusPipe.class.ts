import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { EResourceStatus } from '../constant';

export class CheckStatusPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value) {
      if (value !== EResourceStatus.PUBLISH) {
        throw new BadRequestException('ONLY_ALLOW_STATUS_PUBLISH');
      }
    }
    return value;
  }
}
