import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { AgentInput } from '../../../agent/agent.dto';
import { EAgentCreatedOn, EBannerStatus } from '../../constant';
import { checkEmail } from '../../pipeUtils/emailValidate';
import { checkPhoneNumber } from '../../pipeUtils/phoneNumberValidate';

@Injectable()
export class CreateAgentPipe implements PipeTransform<any> {
  transform(value: AgentInput, metadata: ArgumentMetadata) {
    if (!value.companyName) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'COMPANY_NAME_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.companyPhone) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'COMPANY_PHONE_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!checkPhoneNumber(value.companyPhone)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'COMPANY_PHONE_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.companyEmail && !checkEmail(value.companyEmail)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'COMPANY_EMAIL_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.country) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'COUNTRY_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.city) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CITY_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.street) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'STREET_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.contactName) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ' CONTACT_NAME_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.contactEmail) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CONTACT_EMAIL_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!checkEmail(value.contactEmail)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CONTACT_EMAIL_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.contactPhone) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CONTACT_PHONE_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!checkPhoneNumber(value.contactPhone)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CONTACT_PHONE_INVALID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.status) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'STATUS_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (value.status) {
      const status: any = value.status;
      if (!Object.values(EBannerStatus).includes(status)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'STATUS_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (value.createdOn) {
      const resource: any = value.createdOn;
      if (!Object.values(EAgentCreatedOn).includes(resource)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'CREATED_ON_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return value;
  }
}
