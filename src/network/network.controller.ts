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
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { BranchPipe } from '../lib/validatePipe/network/branchPipe.class';
import { CountryPipe } from '../lib/validatePipe/network/countryPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { BranchInput, CountryInput } from './network.dto';
import { NetworkService } from './network.service';

@Controller('network')
@ApiTags('Network')
@UseFilters(new HttpExceptionFilter())
export class NetworkController {
  constructor(private networkService: NetworkService) {}

  @Get('/branch')
  // @ApiQuery({ name: 'searchValue', required: false, type: String })
  @ApiQuery({ name: 'page', type: String, required: false })
  @ApiQuery({ name: 'limit', type: String, required: false })
  async getAllBranch(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    // @Query('searchValue') searchValue: string,
  ) {
    return await this.networkService.getAllBranch(page, limit);
  }

  @Get('/branch/:id')
  async getBranch(@Param('id', new CheckUUID()) id: string) {
    return await this.networkService.getBranch(id);
  }

  @Post('/branch')
  @ApiBody({ type: BranchInput })
  async createBranch(@Body(new BranchPipe()) branchInput: BranchInput) {
    return this.networkService.createBranch(branchInput);
  }

  @Put('branch/:id')
  @ApiBody({ type: BranchInput })
  async updateBranch(@Param('id', new CheckUUID()) id: string, @Body(new BranchPipe()) branchInput: BranchInput) {
    return this.networkService.updateBranch(id, branchInput);
  }

  @Delete('branch/:id')
  async deleteBranch(@Param('id', new CheckUUID()) id: string) {
    return this.networkService.deleteBranch(id);
  }

  @Get('/country')
  async getAllCountry() {
    return await this.networkService.getAllCountry();
  }

  @Post('/country')
  @ApiBody({ type: CountryInput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createCountry(@UploadedFile() image: any, @Body(new CountryPipe()) countryInput: CountryInput) {
    return this.networkService.createCountry(image, countryInput);
  }

  @Put('/country/:id')
  @ApiBody({ type: CountryInput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async updateCountry(
    @Param('id', new CheckUUID()) id: string,
    @UploadedFile() image: any,
    @Body(new CountryPipe()) countryInput: CountryInput,
  ) {
    return this.networkService.updateCountry(id, image, countryInput);
  }
}
