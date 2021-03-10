import { SolutionService } from './solution.service';
import { Body, Controller, Get, Post, Query, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSolutionInput, SolutionPictureInput } from './solution.dto';
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
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async uploadImageBlog(@UploadedFile() image: SolutionPictureInput) {
    return await this.solutionService.uploadImage(image);
  }

  @Post()
  @ApiBody({
    type: [CreateSolutionInput],
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async createSolution(@Body(new CreateSolutionPipe()) solutionInput: [CreateSolutionInput]) {
    return await this.solutionService.createSolution(solutionInput);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async getAllSolution(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
  ) {
    return await this.solutionService.getAllSolution(page, limit);
  }
}
