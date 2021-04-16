import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EResourceStatus } from '../../constant';

@Injectable()
export class CheckStatusFilterPipe implements PipeTransform<any> {
  transform(values: string[], metadata: ArgumentMetadata) {
    if (values && values.length > 0) {
      for (const item of values) {
        const status: any = item;
        if (!Object.values(EResourceStatus).includes(status)) {
          throw new BadRequestException('STATUS_INVALID');
        }
      }
    }
    return values;
  }
}
