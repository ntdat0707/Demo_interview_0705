import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { FocusedMarketInput } from '../../../focused-market/focused-market.dto';
import { EResourceStatus } from '../../constant';
import { checkDateTime } from '../../pipeUtils/dateValidate';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class FocusedMarketPipe implements PipeTransform<any> {
  transform(value: [FocusedMarketInput], metadata: ArgumentMetadata) {
    for (const item of value) {
      if (item.id) {
        if (!checkUUID(item.id)) {
          throw new BadRequestException('ID_INVALID');
        }
      }
      if (!item.languageId) {
        throw new BadRequestException('LANGUAGE_REQUIRED');
      }
      if (!checkUUID(item.languageId)) {
        throw new BadRequestException('LANGUAGE_INVALID');
      }
      if (!item.title) {
        throw new BadRequestException('TITLE_REQUIRED');
      }
      if (!item.status) {
        throw new BadRequestException('STATUS_REQUIRED');
      } else {
        const status: any = item.status;
        if (!Object.values(EResourceStatus).includes(status)) {
          throw new BadRequestException('STATUS_INVALID');
        }
      }
      if (!item.isPublish) {
        throw new BadRequestException('IS_PUBLISH_REQUIRED');
      }
      if (item.publishDate) {
        if (!checkDateTime(item.publishDate)) {
          throw new BadRequestException('PUBLISH_DATE_REQUIRED');
        }
      }
    }
    return value;
  }
}
