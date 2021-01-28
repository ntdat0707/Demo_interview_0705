import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateBannerPipe } from '../lib/validatePipe/banner/createBannerPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { BannerInput } from './banner.dto';
import { BannerService } from './banner.service';

@Controller('banner')
@ApiTags('Banner')
@UseFilters(new HttpExceptionFilter())
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Post('/create-banner')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BannerInput })
  async createBanner(@UploadedFile() image: any, @Body(new CreateBannerPipe()) createBannerInput: BannerInput) {
    return this.bannerService.createBanner(image, createBannerInput);
  }

  @Put('/update-banner/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BannerInput })
  async updateBanner(
    @Param('id', new CheckUUID()) id: string,
    @UploadedFile() image: any,
    @Body(new CreateBannerPipe()) updateBannerInput: BannerInput,
  ) {
    return this.bannerService.updateBanner(id, image, updateBannerInput);
  }

  @Get('/get-banner/:id')
  async getBanner(@Param('id', new CheckUUID()) id: string) {
    return this.bannerService.getBanner(id);
  }

  @Delete('/delete-banner/:id')
  async deleteBanner(@Param('id', new CheckUUID()) id: string) {
    return this.bannerService.deleteBanner(id);
  }
}
