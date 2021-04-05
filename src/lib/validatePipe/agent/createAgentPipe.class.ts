import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AgentInput } from '../../../agent/agent.dto';
import { EBannerStatus } from '../../constant';
import { checkEmail } from '../../pipeUtils/emailValidate';
import { checkPhoneNumber } from '../../pipeUtils/phoneNumberValidate';

@Injectable()
export class CreateAgentPipe implements PipeTransform<any> {
  transform(value: AgentInput, metadata: ArgumentMetadata) {
    if (!value.companyName) {
      throw new BadRequestException('COMPANY_NAME_REQUIRED');
    }
    if (!value.companyPhone) {
      throw new BadRequestException('COMPANY_PHONE_REQUIRED');
    }
    if (!checkPhoneNumber(value.companyPhone)) {
      throw new BadRequestException('COMPANY_PHONE_INVALID');
    }
    if (value.companyEmail && !checkEmail(value.companyEmail)) {
      throw new BadRequestException('COMPANY_EMAIL_INVALID');
    }
    if (!value.country) {
      throw new BadRequestException('COUNTRY_REQUIRED');
    }
    if (!value.city) {
      throw new BadRequestException('CITY_REQUIRED');
    }
    if (!value.street) {
      throw new BadRequestException('STREET_REQUIRED');
    }
    if (!value.contactName) {
      throw new BadRequestException('CONTACT_NAME_REQUIRED');
    }
    if (!value.contactEmail) {
      throw new BadRequestException('CONTACT_EMAIL_REQUIRED');
    }
    if (!checkEmail(value.contactEmail)) {
      throw new BadRequestException('CONTACT_EMAIL_INVALID');
    }
    if (!value.contactPhone) {
      throw new BadRequestException('CONTACT_PHONE_REQUIRED');
    }
    if (!checkPhoneNumber(value.contactPhone)) {
      throw new BadRequestException('CONTACT_PHONE_INVALID');
    }
    if (!value.status) {
      throw new BadRequestException('STATUS_REQUIRED');
    }
    if (value.status) {
      const status: any = value.status;
      if (!Object.values(EBannerStatus).includes(status)) {
        throw new BadRequestException('STATUS_INVALID');
      }
    }
    if (value.isSendMail === undefined) {
      throw new BadRequestException('IS_SEND_MAIL_REQUIRED');
    }
    return value;
  }
}
