import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePostMetaPipe } from '../lib/validatePipe/post-meta/createPostMetaPipe.class';
import { CreatePostMetaInput } from './post-meta.dto';
import { PostMetaService } from './post-meta.service';

@Controller('post-meta')
@ApiTags('Post-meta')
export class PostMetaController {
  constructor(private postMetaService: PostMetaService) {}
  @Post()
  @ApiBody({ type: CreatePostMetaInput })
  async createUser(@Body(new CreatePostMetaPipe()) postMetaInput: CreatePostMetaInput) {
    return await this.postMetaService.createPostMeta(postMetaInput);
  }
}
