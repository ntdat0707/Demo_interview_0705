import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { CountryInput } from '../../../network/network.dto';

export class CountryPipe implements PipeTransform<any> {
  transform(value: CountryInput, metadata: ArgumentMetadata) {
    if (!value.name) {
      throw new BadRequestException('NAME_REQUIRED');
    }
    return value;
  }
}
