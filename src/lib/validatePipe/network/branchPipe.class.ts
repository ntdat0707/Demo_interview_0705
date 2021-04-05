import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { BranchInput } from '../../../network/network.dto';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class BranchPipe implements PipeTransform<any> {
  transform(value: BranchInput, metadata: ArgumentMetadata) {
    if (!value.countryId) {
      throw new BadRequestException('COUNTRY_REQUIRED');
    } else {
      if (!checkUUID(value.countryId)) {
        throw new BadRequestException('COUNTRY_INVALID');
      }
    }
    if (!value.province) {
      throw new BadRequestException('PROVINCE_REQUIRED');
    }
    if (!value.address) {
      throw new BadRequestException('ADDRESS_REQUIRED');
    }
    if (!value.contact) {
      throw new BadRequestException('CONTACT_REQUIRED');
    }
    return value;
  }
}
