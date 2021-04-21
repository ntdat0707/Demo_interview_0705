import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { checkEmail } from '../../../lib/pipeUtils/emailValidate';
import { checkPassword } from '../../../lib/pipeUtils/passwordValidate';
import { LoginCustomerInput } from '../../../auth/auth.dto';

@Injectable()
export class LoginPipe implements PipeTransform<any> {
  async transform(value: LoginCustomerInput) {
    if (!value.email) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'EMAIL_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!value.password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'PASSWORD_REQUIRED',
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
    return value;
  }
}
