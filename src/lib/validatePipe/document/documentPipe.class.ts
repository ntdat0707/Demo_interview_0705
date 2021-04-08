import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { DocumentInput } from '../../../document/document.dto';
import { EDocumentFlag, EResourceStatus } from '../../constant';

export class DocumentPipe implements PipeTransform<any> {
  transform(value: DocumentInput, metadata: ArgumentMetadata) {
    if (!value.status) {
      throw new BadRequestException('STATUS_REQUIRED');
    } else {
      const status: any = value.status;
      if (!Object.values(EResourceStatus).includes(status)) {
        throw new BadRequestException('STATUS_INVALID');
      }
    }
    if (!value.flag) {
      throw new BadRequestException('FLAG_REQUIRED');
    } else {
      const flag: any = value.flag;
      if (!Object.values(EDocumentFlag).includes(flag)) {
        throw new BadRequestException('FLAG_INVALID');
      }
    }
    return value;
  }
}
