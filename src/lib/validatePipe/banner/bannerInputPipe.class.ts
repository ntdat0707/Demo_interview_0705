import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { BannerInput } from '../../../banner/banner.dto';
import { EBannerStatus } from '../../constant';
import { checkDate } from '../../pipeUtils/dateValidate';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class BannerInputPipe implements PipeTransform<any> {
  transform(values: [BannerInput], metadata: ArgumentMetadata) {
    for (const value of values) {
      if (value.id) {
        if (!checkUUID(value.id)) {
          throw new BadRequestException('ID_INVALID');
        }
      }
      if (!value.languageId) {
        throw new BadRequestException('LANGUAGE_REQUIRED');
      } else {
        if (!checkUUID(value.languageId)) {
          throw new BadRequestException('LANGUAGE_INVALID');
        }
      }
      if (!value.title) {
        throw new BadRequestException('TITLE_REQUIRED');
      }
      if (!value.status) {
        throw new BadRequestException('STATUS_REQUIRED');
      } else {
        const status: any = value.status;
        if (!Object.values(EBannerStatus).includes(status)) {
          throw new BadRequestException('STATUS_INVALID');
        }
      }
      if (value.validFrom && !checkDate(value.validFrom)) {
        throw new BadRequestException('VALID_FROM_INVALID');
      }
      if (value.validTo && !checkDate(value.validTo)) {
        throw new BadRequestException('VALID_TO_INVALID');
      }
    }
    return values;
  }
}
