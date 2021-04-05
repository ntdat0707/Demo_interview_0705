import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UpdateVideoInput } from '../../../video/video.dto';
import { EResourceStatus } from '../../constant';

@Injectable()
export class UpdateVideoPipe implements PipeTransform<any> {
  transform(values: [UpdateVideoInput], metadata: ArgumentMetadata) {
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
    }
    return values;
  }
}
