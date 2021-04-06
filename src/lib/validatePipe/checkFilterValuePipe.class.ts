import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { EFilterValue } from '../constant';

export class CheckFilterValuePipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value) {
      if (!Object.values(EFilterValue).includes(value)) {
        throw new BadRequestException('FILTER_VALUE_INVALID');
      }
    }
    return value;
  }
}
