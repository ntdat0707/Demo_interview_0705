import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CreatePostPipe } from '../lib/validatePipe/post/createPostPipe.class';
import { UpdatePostPipe } from '../lib/validatePipe/post/updatePostPipe.class';
import { CreatePostInput, UpdatePostInput } from './post.dto';
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

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getAllPost(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
  ) {
    return await this.postService.getAllPost(page, limit);
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string) {
    return await this.postService.getPostById(id);
  }

  @Put('/:id')
  @ApiBody({ type: UpdatePostInput })
  async updateUser(@Param('id') id: string, @Body(new UpdatePostPipe()) postInput: UpdatePostInput) {
    return await this.postService.updatePost(id, postInput);
  }
}
