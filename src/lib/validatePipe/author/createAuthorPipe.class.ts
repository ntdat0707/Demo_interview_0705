import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { AuthorInput } from '../../../author/author.dto';
import { checkEmail } from '../../pipeUtils/emailValidate';

export class CreateAuthorPipe implements PipeTransform<any> {
  transform(value: AuthorInput, metadata: ArgumentMetadata) {
    if (!value.fullName) {
      throw new BadRequestException('NAME_REQUIRED');
    }
    if (value.email) {
      if (!checkEmail(value.email)) {
        throw new BadRequestException('EMAIL_INVALID');
      }
    }
    return value;
  }
}
