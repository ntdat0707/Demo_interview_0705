import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreatePostInput } from '../../../post/post.dto';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class CreatePostPipe implements PipeTransform<any> {
  transform(value: CreatePostInput, metadata: ArgumentMetadata) {
    if (!value.title) {
      throw new BadRequestException('TITLE_REQUIRED');
    }
    if (value.userId && !checkUUID(value.userId)) {
      throw new BadRequestException('USER_ID_INVALID');
    }
    if (!value.content) {
      throw new BadRequestException('CONTENT_REQUIRED');
    }
    return value;
  }
}
