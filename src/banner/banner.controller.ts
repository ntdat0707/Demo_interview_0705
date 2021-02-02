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
import { UpdateIndexBannerPipe } from '../lib/validatePipe/banner/updateIndexBannerPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { BannerIndexInput, BannerInput, ImageBannerInput } from './banner.dto';
import { BannerService } from './banner.service';

@Controller('banner')
@ApiTags('Banner')
@UseFilters(new HttpExceptionFilter())
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get('/get-all-banner')
  async getAllBanner() {
    return await this.bannerService.getAllBanner();
  }
  @Post('/upload-image-resource')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImageBannerInput,
  })
  async uploadImageBlog(@UploadedFile() image: ImageBannerInput) {
    return await this.bannerService.uploadImage(image);
  }

  @Post('/create-banner')
  @ApiBody({ type: BannerInput })
  async createBanner(@Body(new CreateBannerPipe()) createBannerInput: BannerInput) {
    return await this.bannerService.createBanner(createBannerInput);
  }

  @Put('/update-banner/:id')
  @ApiBody({ type: BannerInput })
  async updateBanner(
    @Param('id', new CheckUUID()) id: string,
    @Body(new CreateBannerPipe()) updateBannerInput: BannerInput,
  ) {
    return await this.bannerService.updateBanner(id, updateBannerInput);
  }

  @Get('/get-banner/:id')
  async getBanner(@Param('id', new CheckUUID()) id: string) {
    return await this.bannerService.getBanner(id);
  }

  @Delete('/delete-banner/:id')
  async deleteBanner(@Param('id', new CheckUUID()) id: string) {
    return await this.bannerService.deleteBanner(id);
  }

  @Put('/update-index-banner')
  @ApiBody({ type: [BannerIndexInput] })
  async updateIndexBanner(@Body(new UpdateIndexBannerPipe()) bannerIndexInput: [BannerIndexInput]) {
    return await this.bannerService.updateIndexBanner(bannerIndexInput);
  }
}
