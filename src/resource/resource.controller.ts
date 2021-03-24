import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CreateResourcePipe } from '../lib/validatePipe/resource/createResourcePipe.class';
import { UpdateResourcePipe } from '../lib/validatePipe/resource/updateResourcePipe.class';
import { CreateResourceInput, ResourcePictureInput, UpdateResourceInput } from './resource.dto';
import { ResourceService } from './resource.service';

@Controller('blog')
@ApiTags('Blog')
@UseFilters(new HttpExceptionFilter())
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post('/upload-image-resource')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ResourcePictureInput,
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async uploadImageBlog(@UploadedFile() image: ResourcePictureInput) {
    return await this.resourceService.uploadImage(image);
  }

  @Post()
  @ApiBody({
    type: [CreateResourceInput],
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async createResource(@Body(new CreateResourcePipe()) resourceInput: [CreateResourceInput]) {
    return await this.resourceService.createResource(resourceInput);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'languageId', required: true })
  async getAllResources(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('languageId') languageId: string,
  ) {
    return await this.resourceService.getAllResource(page, limit, languageId);
  }

  @Get('/:code')
  async getResource(@Param('code') code: string) {
    return await this.resourceService.getResource(code);
  }

  @Get('/SEO/:link')
  async getResourceSEO(@Param('link') link: string, @Query('languageId') languageId: string) {
    return await this.resourceService.getResourceSEO(link, languageId);
  }

  @Put('/:code')
  @ApiBody({
    type: [UpdateResourceInput],
  })
  async updateResource(
    @Param('code') code: string,
    @Body(new UpdateResourcePipe()) resourceUpdate: [UpdateResourceInput],
  ) {
    return await this.resourceService.updateResource(code, resourceUpdate);
  }

  @Delete('/:code')
  async deleteResource(@Param('code') code: string) {
    return await this.resourceService.deleteResource(code);
  }
}
