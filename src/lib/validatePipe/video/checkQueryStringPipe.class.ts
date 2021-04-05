import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EFlagUploadVideo } from '../../constant';

@Injectable()
export class CheckFlagPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('FLAG_REQUIRED');
    }
    if (!Object.values(EFlagUploadVideo).includes(value)) {
      throw new BadRequestException('FLAG_INVALID');
    }
    return value;
  }
}
