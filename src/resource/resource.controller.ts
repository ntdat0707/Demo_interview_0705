import { Body, Controller, Get, Param, Post, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateResourcePipe } from '../lib/validatePipe/resource/createResourcePipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { CreateResourceInput, ResourcePictureInput } from './resource.dto';
import { ResourceService } from './resource.service';

@Controller('resource')
@ApiTags('Resource')
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

  @Post('/resource')
  @ApiBody({
    type: CreateResourceInput,
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async createResource(@Body(new CreateResourcePipe()) resourceInput: CreateResourceInput) {
    return await this.resourceService.createResource(resourceInput);
  }

  @Get('/all-resources')
  async getAllResources() {
    return await this.resourceService.getAllResource();
  }

  @Get('/resource/:id')
  async getResource(@Param('id', new CheckUUID()) id: string) {
    return await this.resourceService.getResource(id);
  }
}
