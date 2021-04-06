import { UpdateSolutionPipe } from './../lib/validatePipe/solution/updateSolutionPipe.class';
import { SolutionService } from './solution.service';
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
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSolutionInput, SolutionPictureInput, UpdateSolutionInput } from './solution.dto';
import { CreateSolutionPipe } from '../lib/validatePipe/solution/createSolutionPipe.class';
import { CheckLanguagePipe } from '../lib/validatePipe/focused-market/checkLanguagePipe.class';
import { CheckStatusPipe } from '../lib/validatePipe/checkStatusPipe.class';

@Controller('solution')
@ApiTags('Solution')
@UseFilters(new HttpExceptionFilter())
export class SolutionController {
  constructor(private solutionService: SolutionService) {}

  @Post('/upload-image-solution')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SolutionPictureInput,
  })
  async uploadImageBlog(@UploadedFile() image: SolutionPictureInput) {
    return await this.solutionService.uploadImage(image);
  }

  @Post()
  @ApiBody({
    type: [CreateSolutionInput],
  })
  async createSolution(@Body(new CreateSolutionPipe()) solutionInput: [CreateSolutionInput]) {
    return await this.solutionService.createSolution(solutionInput);
  }

  @Get()
  @ApiQuery({ name: 'languageId', required: true })
  @ApiQuery({ name: 'status', required: false })
  async getAllSolution(
    @Query('languageId') languageId: string,
    @Query('status', new CheckStatusPipe()) status: string,
  ) {
    return await this.solutionService.getAllSolution(languageId, status);
  }

  @Get('/:code')
  @ApiQuery({ name: 'languageId', required: false, type: String })
  async getSolution(@Param('code') code: string, @Query('languageId', new CheckLanguagePipe()) languageId: string) {
    return await this.solutionService.getSolution(code, languageId);
  }

  @Put('/:code')
  @ApiBody({
    type: [UpdateSolutionInput],
  })
  async updateSolution(
    @Param('code') code: string,
    @Body(new UpdateSolutionPipe()) solutionInput: [UpdateSolutionInput],
  ) {
    return await this.solutionService.updateSolution(code, solutionInput);
  }

  @Delete('/:code')
  async deleteSolution(@Param('code') code: string) {
    return await this.solutionService.deleteSolution(code);
  }
}
