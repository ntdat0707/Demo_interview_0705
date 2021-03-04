import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { AuthorInput } from '../../../author/author.dto';
import { checkEmail } from '../../pipeUtils/emailValidate';

export class CreateAuthorPipe implements PipeTransform<any> {
  transform(value: AuthorInput, metadata: ArgumentMetadata) {
    if (!value.fullName) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'NAME_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.email) {
      if (!checkEmail(value.email)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'EMAIL_NOT_VALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return value;
  }
}
