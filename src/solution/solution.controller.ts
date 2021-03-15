import { UpdateSolutionPipe } from './../lib/validatePipe/solution/updateSolutionPipe.class';
import { SolutionService } from './solution.service';
import { Body, Controller, Get, Post, Put, Query, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSolutionInput, SolutionPictureInput, UpdateSolutionInput } from './solution.dto';
import { CreateSolutionPipe } from '../lib/validatePipe/solution/createSolutionPipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';

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
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'limit', required: true })
  async getAllSolution(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
  ) {
    return await this.solutionService.getAllSolution(page, limit);
  }

  @Get('/code')
  @ApiQuery({ name: 'code', required: true })
  async getAllSolutionByCode(@Query('code') code: string) {
    return await this.solutionService.getAllSolutionByCode(code);
  }

  @Put()
  @ApiQuery({
    name: 'code',
    required: true,
  })
  @ApiBody({
    type: [UpdateSolutionInput],
  })
  async updateResource(
    @Query('code') code: string,
    @Body(new UpdateSolutionPipe()) solutionInput: [UpdateSolutionInput],
  ) {
    return await this.solutionService.updateSolution(code, solutionInput);
  }
}
