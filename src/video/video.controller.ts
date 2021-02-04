import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { CheckFlagPipe } from '../lib/validatePipe/video/checkQueryStringPipe.class';
import { UpdateVideoPipe } from '../lib/validatePipe/video/updateVideoPipe.class';
import { UploadVideoPipe } from '../lib/validatePipe/video/uploadVideoPipe.class';
import { UpdateVideoInput, UploadVideoInput } from './video.dto';
import { VideoService } from './video.service';

@Controller('video')
@ApiTags('Video')
@UseFilters(new HttpExceptionFilter())
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get('/all-video')
  async getAllVideo(
    @Query('flag', new CheckFlagPipe()) flag: string,
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
  ) {
    return await this.videoService.getAllVideo(flag, page, limit);
  }

  @Get('/:id')
  async getVideo(@Param('id', new CheckUUID()) id: string) {
    return await this.videoService.getVideo(id);
  }

  @Post('/upload-video')
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadVideoInput })
  async uploadVideo(@UploadedFile() video: any, @Body(new UploadVideoPipe()) uploadVideo: UploadVideoInput) {
    return await this.videoService.uploadVideo(video, uploadVideo);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateVideoInput })
  async updateVideo(
    @Param('id', new CheckUUID()) id: string,
    @UploadedFile() video: any,
    @Body(new UpdateVideoPipe()) updateVideo: UpdateVideoInput,
  ) {
    return await this.videoService.updateVideo(id, video, updateVideo);
  }

  @Delete('/:id')
  async deleteVideo(@Param('id', new CheckUUID()) id: string) {
    return await this.videoService.deleteVideo(id);
  }
}
