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
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { CreateResourceInput, ResourcePictureInput, UpdateResourceInput } from './resource.dto';
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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getAllResources(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
  ) {
    return await this.resourceService.getAllResource(page, limit);
  }

  @Get('/resource/:id')
  async getResource(@Param('id', new CheckUUID()) id: string) {
    return await this.resourceService.getResource(id);
  }

  @Put('/resource/:id')
  async updateResource(
    @Param('id', new CheckUUID()) id: string,
    @Body(new UpdateResourcePipe()) resourceUpdate: UpdateResourceInput,
  ) {
    return await this.resourceService.updateResource(id, resourceUpdate);
  }

  @Delete('/resource/:id')
  async deleteResource(@Param('id', new CheckUUID()) id: string) {
    return await this.resourceService.deleteResource(id);
  }
}
