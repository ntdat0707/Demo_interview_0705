import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateLabelPipe } from '../lib/validatePipe/label/createLabelPipe.class';
import { LabelInput } from './label.dto';
import { LabelService } from './label.service';
@Controller('label')
@ApiTags('Label')
@UseFilters(new HttpExceptionFilter())
export class LabelController {
  constructor(private labelService: LabelService) {}
  @Post('create-label')
  @ApiBody({
    type: LabelInput,
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async createLabel(@Body(new CreateLabelPipe()) labelInput: LabelInput) {
    return this.labelService.createLabel(labelInput);
  }
}
