import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UpdateUserInput } from '../../../user/user.dto';
import { EUserStatus } from '../../constant';
import { checkEmail } from '../../pipeUtils/emailValidate';

@Injectable()
export class UpdateUserPipe implements PipeTransform<any> {
  transform(value: UpdateUserInput, metadata: ArgumentMetadata) {
    if (!value.email) {
      throw new BadRequestException('EMAIL_REQUIRED');
    }
    if (value.email && !checkEmail(value.email)) {
      throw new BadRequestException('EMAIL_INVALID');
    }

    if (!value.fullName) {
      throw new BadRequestException('FULL_NAME_REQUIRED');
    }
    const status: any = value.status;
    if (!Object.values(EUserStatus).includes(status)) {
      throw new BadRequestException('STATUS_INVALID');
    }
    return value;
  }
}
