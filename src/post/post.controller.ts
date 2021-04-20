import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePostPipe } from '../lib/validatePipe/post/createPostPipe.class';
import { CreatePostInput } from './post.dto';
import { PostService } from './post.service';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @ApiBody({
    type: CreatePostInput,
  })
  async createPost(@Body(new CreatePostPipe()) postInput: CreatePostInput) {
    return await this.postService.createPost(postInput);
  }
}
