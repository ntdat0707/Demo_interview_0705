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
import { BannerInputPipe } from '../lib/validatePipe/banner/bannerInputPipe.class';
import { UpdateIndexBannerPipe } from '../lib/validatePipe/banner/updateIndexBannerPipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CheckLanguagePipe } from '../lib/validatePipe/focused-market/checkLanguagePipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { BannerIndexInput, BannerInput, ImageBannerInput } from './banner.dto';
import { BannerService } from './banner.service';

@Controller('banner')
@ApiTags('Banner')
@UseFilters(new HttpExceptionFilter())
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get('')
  @ApiQuery({ name: 'languageId', required: true, type: String })
  @ApiQuery({ name: 'page', type: String, required: false })
  @ApiQuery({ name: 'limit', type: String, required: false })
  async getAllBanner(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('languageId', new CheckUUID()) languageId: string,
  ) {
    return await this.bannerService.getAllBanner(languageId, page, limit);
  }

  @Get('/web/all')
  @ApiQuery({ name: 'languageId', required: true, type: String })
  @ApiQuery({ name: 'page', type: String, required: false })
  @ApiQuery({ name: 'limit', type: String, required: false })
  async getAllBannerWeb(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('languageId', new CheckUUID()) languageId: string,
  ) {
    return await this.bannerService.getAllBannerWeb(languageId, page, limit);
  }

  @Get('/:code')
  @ApiQuery({ name: 'languageId', required: false, type: String })
  async getBanner(@Param('code') code: string, @Query('languageId', new CheckLanguagePipe()) languageId: string) {
    return await this.bannerService.getBanner(code, languageId);
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
  @ApiBody({ type: [BannerInput] })
  async createBanner(@Body(new BannerInputPipe()) createBannerInput: [BannerInput]) {
    return await this.bannerService.createBanner(createBannerInput);
  }

  @Put('/:code')
  @ApiBody({ type: [BannerInput] })
  async updateBanner(@Param('code') code: string, @Body(new BannerInputPipe()) updateBannerInput: [BannerInput]) {
    return await this.bannerService.updateBanner(code, updateBannerInput);
  }

  @Delete('/:code')
  async deleteBanner(@Param('code') code: string) {
    return await this.bannerService.deleteBanner(code);
  }

  @Put('available/update/')
  @ApiBody({ type: [BannerIndexInput] })
  async updateIndexBanner(@Body(new UpdateIndexBannerPipe()) bannerIndexInput: [BannerIndexInput]) {
    return await this.bannerService.updateIndexBanner(bannerIndexInput);
  }
}
