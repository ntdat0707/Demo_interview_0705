import { Body, Controller, Post, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateBannerPipe } from '../lib/validatePipe/banner/createBannerPipe.class';
import { CreateBannerInput } from './banner.dto';
import { BannerService } from './banner.service';

@Controller('banner')
@ApiTags('Banner')
@UseFilters(new HttpExceptionFilter())
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Post('/create-banner')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateBannerInput })
  async createBanner(@UploadedFile() image: any, @Body(new CreateBannerPipe()) createBannerInput: CreateBannerInput) {
    return this.bannerService.createBanner(image, createBannerInput);
  }
}
