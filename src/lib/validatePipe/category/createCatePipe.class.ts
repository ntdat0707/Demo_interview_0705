import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { CreateCategoryInput } from '../../../category/category.dto';
import { ECategoryType, EResourceStatus } from '../../constant';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class CreateCatePipe implements PipeTransform<any> {
  transform(values: [CreateCategoryInput], metadata: ArgumentMetadata) {
    for (const value of values) {
      if (!value.title) {
        throw new BadRequestException('TITLE_REQUIRED');
      }
      if (!value.languageId) {
        throw new BadRequestException('LANGUAGE_REQUIRED');
      } else {
        if (!checkUUID(value.languageId)) {
          throw new BadRequestException('LANGUAGE_ID_INVALID');
        }
      }
      if (!value.link) {
        throw new BadRequestException('URL_REQUIRED');
      }
      if (!value.type) {
        throw new BadRequestException('TYPE_REQUIRED');
      } else {
        if (!(Object.values(ECategoryType) as any[]).includes(value.type)) {
          throw new BadRequestException('TYPE_INVALID');
        }
      }
    }
    return values;
  }
}

export class StatusCatePipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('STATUS_REQUIRED');
    }
    if (!(Object.values(EResourceStatus) as any[]).includes(value)) {
      throw new BadRequestException('STATUS_INVALID');
    }
    return value;
  }
}
