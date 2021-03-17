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
import { CheckLanguagePipe } from '../lib/validatePipe/focused-market/checkLanguagePipe.class';
import { FocusedMarketPipe } from '../lib/validatePipe/focused-market/FocusedMarketPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { FocusedMarketInput, UploadFocusedMarketInput } from './focused-market.dto';
import { FocusedMarketService } from './focused-market.service';

@Controller('focused-market')
@ApiTags('Focus-market')
@UseFilters(new HttpExceptionFilter())
export class FocusedMarketController {
  constructor(private focusedMarketService: FocusedMarketService) {}

  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFocusedMarketInput,
  })
  async uploadImageBlog(@UploadedFile() image: UploadFocusedMarketInput) {
    return await this.focusedMarketService.uploadImage(image);
  }

  @Get('')
  @ApiQuery({ name: 'languageId', required: true, type: String })
  async getAllFocusedMarket(@Query('languageId', new CheckUUID()) languageId: string) {
    return await this.focusedMarketService.getAllFocusedMarket(languageId);
  }

  @Get('/:code')
  @ApiQuery({ name: 'languageId', required: false, type: String })
  async getFocusedMarket(
    @Param('code') code: string,
    @Query('languageId', new CheckLanguagePipe()) languageId: string,
  ) {
    return await this.focusedMarketService.getFocusedMarket(code, languageId);
  }

  @Post('')
  @ApiBody({ type: [FocusedMarketInput] })
  async createFocusedMarket(@Body(new FocusedMarketPipe()) focusedMarketInput: [FocusedMarketInput]) {
    return await this.focusedMarketService.createFocusedMarket(focusedMarketInput);
  }

  @Put('/:code')
  @ApiBody({ type: [FocusedMarketInput] })
  async updateFocusedMarket(
    @Param('code') code: string,
    @Body(new FocusedMarketPipe()) focusedMarketInput: [FocusedMarketInput],
  ) {
    return await this.focusedMarketService.updateFocusedMarket(code, focusedMarketInput);
  }

  @Delete('/:code')
  async DeleteFocusedMarket(@Param('code') code: string) {
    return await this.focusedMarketService.deleteFocusedMarket(code);
  }
}
