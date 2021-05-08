import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UpdatePostInput } from '../../../post/post.dto';

@Injectable()
export class UpdatePostPipe implements PipeTransform<any> {
  transform(value: UpdatePostInput, metadata: ArgumentMetadata) {
    if (!value.title) {
      throw new BadRequestException('TITLE_REQUIRED');
    }
    if (!value.content) {
      throw new BadRequestException('CONTENT_REQUIRED');
    }
    return value;
  }
}
