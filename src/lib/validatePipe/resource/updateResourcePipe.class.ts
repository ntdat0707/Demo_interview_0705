import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UpdateResourceInput } from '../../../resource/resource.dto';
import { EResourceStatus } from '../../constant';
import { checkDateTime } from '../../pipeUtils/dateValidate';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class UpdateResourcePipe implements PipeTransform<any> {
  transform(values: [UpdateResourceInput], metadata: ArgumentMetadata) {
    for (const value of values) {
      if (!value.title) {
        throw new BadRequestException('TITLE_REQUIRED');
      }
      if (value.status) {
        const status: any = value.status;
        if (!Object.values(EResourceStatus).includes(status)) {
          throw new BadRequestException('STATUS_INVALID');
        }
      }
      if (value.publishDate && !checkDateTime(value.publishDate)) {
        throw new BadRequestException('PUBLISH_DATE_INVALID');
      }
      if (value.categoryIds) {
        for (const item of value.categoryIds) {
          if (!checkUUID(item)) {
            throw new BadRequestException('CATEGORY_UUID_INVALID');
          }
        }
      }
      if (value.authorId) {
        if (!checkUUID(value.authorId)) {
          throw new BadRequestException('AUTHOR_UUID_INVALID');
        }
      }
      if (value.labelIds) {
        for (const item of value.labelIds) {
          if (!checkUUID(item)) {
            throw new BadRequestException('LABEL_UUID_INVALID');
          }
        }
      }
      if (value.isEditSEO === true) {
        if (!value.link) {
          throw new BadRequestException('SEO_URL_REQUIRED');
        }
      }
    }
    return values;
  }
}
