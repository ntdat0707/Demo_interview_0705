import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreatePostMetaInput } from '../../../post-meta/post-meta.dto';
import { checkUUID } from '../../pipeUtils/uuidValidate';

@Injectable()
export class CreatePostMetaPipe implements PipeTransform<any> {
  transform(value: CreatePostMetaInput, metadata: ArgumentMetadata) {
    if (!value.key) {
      throw new BadRequestException('TITLE_REQUIRED');
    }
    if (value.postId && !checkUUID(value.postId)) {
      throw new BadRequestException('POST_ID_INVALID');
    }
    if (!value.value) {
      throw new BadRequestException('CONTENT_REQUIRED');
    }
    return value;
  }
}
