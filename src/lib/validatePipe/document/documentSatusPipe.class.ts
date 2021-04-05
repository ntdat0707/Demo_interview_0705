import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { DocumentUpdateStatus } from '../../../document/document.dto';
import { EResourceStatus } from '../../constant';

export class DocumentStatusPipe implements PipeTransform<any> {
  transform(value: DocumentUpdateStatus, metadata: ArgumentMetadata) {
    if (!value.status) {
      throw new BadRequestException('STATUS_REQUIRED');
    }
    const status: any = value.status;
    if (!Object.values(EResourceStatus).includes(status)) {
      throw new BadRequestException('STATUS_INVALID');
    }
    return value;
  }
}
