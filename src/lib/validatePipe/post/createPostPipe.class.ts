import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreatePostInput } from '../../../post/post.dto';

@Injectable()
export class CreatePostPipe implements PipeTransform<any> {
  transform(value: CreatePostInput, metadata: ArgumentMetadata) {
    if (!value.title) {
      throw new BadRequestException('TITLE_REQUIRED');
    }
    if (!value.content) {
      throw new BadRequestException('CONTENT_REQUIRED');
    }
    return value;
  }
}
