import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { BranchInput } from '../../../network/network.dto';
import { checkUUID } from '../../pipeUtils/uuidValidate';

export class BranchPipe implements PipeTransform<any> {
  transform(value: BranchInput, metadata: ArgumentMetadata) {
    if (!value.countryId) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'COUNTRY_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (!checkUUID(value.countryId)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'COUNTRY_INVALID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (!value.province) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'PROVINCE_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.address) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'ADRESS_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!value.contact) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'CONTACT_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
