import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { checkEmail } from '../../pipeUtils/emailValidate';
import { checkPassword } from '../../pipeUtils/passwordValidate';
import { RegisterAccountInput } from '../../../auth/auth.dto';

@Injectable()
export class RegisterPipe implements PipeTransform<any> {
  async transform(value: RegisterAccountInput) {
    if (!value.password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'PASSWORD_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.email) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'EMAIL_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!checkEmail(value.email)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'EMAIL_NOT_VALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!checkPassword(value.password)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'PASSWORD_NOT_VALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!value.fullName) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'FULLNAME_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}
