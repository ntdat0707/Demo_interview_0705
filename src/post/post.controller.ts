import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CreatePostPipe } from '../lib/validatePipe/post/createPostPipe.class';
import { UpdatePostPipe } from '../lib/validatePipe/post/updatePostPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { CreatePostInput, UpdatePostInput } from './post.dto';
import { PostService } from './post.service';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    type: CreatePostInput,
  })
  async createPost(@GetUser('userId') userId: string, @Body(new CreatePostPipe()) postInput: CreatePostInput) {
    return await this.postService.createPost(userId, postInput);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'searchValue', required: false })
  async getAllPost(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('searchValue') searchValue: string,
  ) {
    return await this.postService.getAllPost(page, limit, searchValue);
  }

  @Get('/:id')
  async getPostById(@Param('id', new CheckUUID()) id: string) {
    return await this.postService.getPostById(id);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdatePostInput })
  async updateUser(
    @GetUser('userId') userId: string,
    @Param('id', new CheckUUID()) id: string,
    @Body(new UpdatePostPipe()) postInput: UpdatePostInput,
  ) {
    return await this.postService.updatePost(userId, id, postInput);
  }

  @Get('/user/logged')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPostByUser(@GetUser('userId') userId: string) {
    return await this.postService.getPostByUser(userId);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@GetUser('userId') userId: string, @Param('id', new CheckUUID()) id: string) {
    return await this.postService.deletePost(userId, id);
  }
}
