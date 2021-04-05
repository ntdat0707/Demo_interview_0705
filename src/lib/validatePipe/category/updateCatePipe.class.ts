import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { UpdateCategoryInput } from '../../../category/category.dto';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class UpdateCatePipe implements PipeTransform<any> {
  transform(values: [UpdateCategoryInput], metadata: ArgumentMetadata) {
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
    }
    return values;
  }
}
