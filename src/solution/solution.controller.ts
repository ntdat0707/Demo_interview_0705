import { SolutionService } from './solution.service';
import { Body, Controller, Post, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSolutionInput, SolutionPictureInput } from './solution.dto';
import { CreateSolutionPipe } from '../lib/validatePipe/solution/createSolutionPipe.class';

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
  async createSolution(@Body(new CreateSolutionPipe()) solutionInput: CreateSolutionInput[]) {
    return await this.solutionService.createSolution(solutionInput);
  }
}
