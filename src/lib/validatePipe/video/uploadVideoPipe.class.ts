import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UploadVideoInput } from '../../../video/video.dto';
import { EFlagUploadVideo, EResourceStatus } from '../../constant';

@Injectable()
export class UploadVideoPipe implements PipeTransform<any> {
  transform(values: [UploadVideoInput], metadata: ArgumentMetadata) {
    for (const value of values) {
      if (!value.title) {
        throw new BadRequestException('TITLE_REQUIRED');
      }
      if (!value.status) {
        throw new BadRequestException('STATUS_REQUIRED');
      }
      const status: any = value.status;
      if (!Object.values(EResourceStatus).includes(status)) {
        throw new BadRequestException('STATUS_INVALID');
      }
      if (!value.flag) {
        throw new BadRequestException('FLAG_REQUIRED');
      }
      const flag: any = value.flag;
      if (!Object.values(EFlagUploadVideo).includes(flag)) {
        throw new BadRequestException('FLAG_INVALID');
      }
    }
    return values;
  }
}
