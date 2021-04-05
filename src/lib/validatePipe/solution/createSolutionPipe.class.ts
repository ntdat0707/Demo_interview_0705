import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateSolutionInput } from '../../../solution/solution.dto';
import { EResourceStatus } from '../../constant';
import { checkDateTime } from '../../pipeUtils/dateValidate';

@Injectable()
export class CreateSolutionPipe implements PipeTransform<any> {
  transform(value: [CreateSolutionInput], metadata: ArgumentMetadata) {
    for (const item of value) {
      if (!item.title) {
        throw new BadRequestException('TITLE_REQUIRED');
      }
      if (item.status) {
        const status: any = item.status;
        if (!Object.values(EResourceStatus).includes(status)) {
          throw new BadRequestException('STATUS_INVALID');
        }
      }
      if (!item.languageId) {
        throw new BadRequestException('LANGUAGE_REQUIRED');
      }
      if (item.publishDate && !checkDateTime(item.publishDate)) {
        throw new BadRequestException('PUBLISH_DATE_REQUIRED');
      }
    }
    return value;
  }
}
