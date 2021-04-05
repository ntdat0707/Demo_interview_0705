import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { checkInteger } from '../pipeUtils/integerValidate';

@Injectable()
export class CheckUnSignIntPipe implements PipeTransform<any> {
  async transform(value: string) {
    let result: number;
    if (value !== undefined) {
      if (!checkInteger(value)) {
        throw new BadRequestException('MUST_BE_INTEGER');
      } else {
        result = parseInt(value, 10);
        if (result <= 0) {
          throw new BadRequestException('VALUE_MUST_BE_HIGHER_0');
        }
      }
    }
    return value;
  }
}
