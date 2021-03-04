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
import { CreateBannerPipe } from '../lib/validatePipe/banner/createBannerPipe.class';
import { UpdateIndexBannerPipe } from '../lib/validatePipe/banner/updateIndexBannerPipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { BannerIndexInput, BannerInput, ImageBannerInput } from './banner.dto';
import { BannerService } from './banner.service';

@Controller('banner')
@ApiTags('Banner')
@UseFilters(new HttpExceptionFilter())
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get('')
  async getAllBanner(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
  ) {
    return await this.bannerService.getAllBanner(page, limit);
  }

  @Get('/:id')
  async getBanner(@Param('id', new CheckUUID()) id: string) {
    return await this.bannerService.getBanner(id);
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

  @Post('')
  @ApiBody({ type: BannerInput })
  async createBanner(@Body(new CreateBannerPipe()) createBannerInput: BannerInput) {
    return await this.bannerService.createBanner(createBannerInput);
  }

  @Put('/:id')
  @ApiBody({ type: BannerInput })
  async updateBanner(
    @Param('id', new CheckUUID()) id: string,
    @Body(new CreateBannerPipe()) updateBannerInput: BannerInput,
  ) {
    return await this.bannerService.updateBanner(id, updateBannerInput);
  }

  @Delete('/:id')
  async deleteBanner(@Param('id', new CheckUUID()) id: string) {
    return await this.bannerService.deleteBanner(id);
  }

  @Put('/update-index-banner')
  @ApiBody({ type: [BannerIndexInput] })
  async updateIndexBanner(@Body(new UpdateIndexBannerPipe()) bannerIndexInput: [BannerIndexInput]) {
    return await this.bannerService.updateIndexBanner(bannerIndexInput);
  }
}
