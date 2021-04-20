import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserInput } from '../../../user/user.dto';
import { EUserStatus } from '../../constant';
import { checkEmail } from '../../pipeUtils/emailValidate';

@Injectable()
export class CreateUserPipe implements PipeTransform<any> {
  transform(value: CreateUserInput, metadata: ArgumentMetadata) {
    if (!value.email) {
      throw new BadRequestException('EMAIL_REQUIRED');
    }
    if (value.email && !checkEmail(value.email)) {
      throw new BadRequestException('EMAIL_INVALID');
    }
    if (!value.userName) {
      throw new BadRequestException('USER_NAME_REQUIRED');
    }

    if (value.status) {
      const status: any = value.status;
      if (!Object.values(EUserStatus).includes(status)) throw new BadRequestException('STATUS_INVALID');
    }
    return value;
  }
}
