import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { BannerIndexInput } from '../../../banner/banner.dto';

@Injectable()
export class UpdateIndexBannerPipe implements PipeTransform<any> {
  transform(value: [BannerIndexInput], metadata: ArgumentMetadata) {
    for (const item of value) {
      if (!item.code) {
        throw new BadRequestException('CODE_REQUIRED');
      }
      if (!item.index) {
        throw new BadRequestException('INDEX_REQUIRED');
      }
      if (isNaN(item.index)) {
        throw new BadRequestException('INDEX_NOT_VALID');
      }
    }

    return value;
  }
}
