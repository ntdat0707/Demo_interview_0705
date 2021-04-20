import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserMetaInput } from '../../../user-meta/user-meta.dto';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class CreateUserMetaPipe implements PipeTransform<any> {
  transform(value: UserMetaInput, metadata: ArgumentMetadata) {
    if (!value.key) {
      throw new BadRequestException('TITLE_REQUIRED');
    }
    if (value.userId && !checkUUID(value.userId)) {
      throw new BadRequestException('USER_ID_INVALID');
    }
    if (!value.value) {
      throw new BadRequestException('CONTENT_REQUIRED');
    }
    return value;
  }
}
