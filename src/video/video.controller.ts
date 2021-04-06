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
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { EFlagUploadVideo } from '../lib/constant';
import { CheckFilterValuePipe } from '../lib/validatePipe/checkFilterValuePipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CheckStatusPipe } from '../lib/validatePipe/checkStatusPipe.class';
import { CheckLanguagePipe } from '../lib/validatePipe/focused-market/checkLanguagePipe.class';
import { CheckFlagPipe } from '../lib/validatePipe/video/checkQueryStringPipe.class';
import { UpdateVideoPipe } from '../lib/validatePipe/video/updateVideoPipe.class';
import { UploadVideoPipe } from '../lib/validatePipe/video/uploadVideoPipe.class';
import { UpdateVideoInput, UploadVideoInput, VideoInput } from './video.dto';
import { VideoService } from './video.service';

@Controller('video')
@ApiTags('Video')
@UseFilters(new HttpExceptionFilter())
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get('')
  @ApiQuery({ name: 'flag', type: String, required: true, enum: Object.values(EFlagUploadVideo) })
  @ApiQuery({ name: 'languageId', type: String, required: true })
  @ApiQuery({ name: 'status', type: String, required: false })
  @ApiQuery({ name: 'searchValue', required: false, type: String })
  @ApiQuery({ name: 'filterValue', required: false, type: String })
  async getAllVideo(
    @Query('flag', new CheckFlagPipe()) flag: string,
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('languageId', new CheckLanguagePipe()) languageId: string,
    @Query('status', new CheckStatusPipe()) status: string,
    @Query('searchValue') searchValue: string,
    @Query('filterValue', new CheckFilterValuePipe()) filterValue: string,
  ) {
    return await this.videoService.getAllVideo(flag, page, limit, languageId, status, searchValue, filterValue);
  }

  @Get('/:code')
  @ApiQuery({ name: 'languageId', type: String, required: false })
  async getVideo(@Param('code') code: string, @Query('languageId') languageId: string) {
    return await this.videoService.getVideo(code, languageId);
  }

  @Post('/upload-video')
  @ApiBody({ type: [UploadVideoInput] })
  async uploadVideo(@Body(new UploadVideoPipe()) uploadVideos: [UploadVideoInput]) {
    return await this.videoService.uploadVideos(uploadVideos);
  }

  @Post('/upload-video-file')
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: VideoInput,
  })
  async uploadVideoFile(@UploadedFile() video: VideoInput) {
    return await this.videoService.uploadVideoFile(video);
  }

  @Put('/:code')
  @ApiBody({ type: [UpdateVideoInput] })
  async updateVideo(@Param('code') code: string, @Body(new UpdateVideoPipe()) updateVideos: [UpdateVideoInput]) {
    return await this.videoService.updateVideo(code, updateVideos);
  }

  @Delete('/:code')
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  async deleteVideo(@Param('code') code: string, @Query('categoryId') category: string) {
    return await this.videoService.deleteVideo(code, category);
  }
}
