import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { checkUUID } from '../pipeUtils/uuidValidate';

@Injectable()
export class CheckUUID implements PipeTransform<any> {
  async transform(value: string): Promise<string> {
    if (value && !checkUUID(value)) {
      throw new BadRequestException('ID_INVALID');
    }
    return value;
  }
}
