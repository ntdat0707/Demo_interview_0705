import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { EDocumentFlag } from '../../constant';

export class CheckFlagPipe implements PipeTransform<any> {
  transform(flag: any, metadata: ArgumentMetadata) {
    if (!flag) {
      throw new BadRequestException('FLAG_REQUIRED');
    }
    if (!Object.values(EDocumentFlag).includes(flag)) {
      throw new BadRequestException('FLAG_INVALID');
    }
    return flag;
  }
}
