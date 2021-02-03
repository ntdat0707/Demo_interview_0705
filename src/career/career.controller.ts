import { CreateCareerPipe } from './../lib/validatePipe/career/createCareerPipe.class';
import { Body, Controller, Delete, Get, Param, Post, Put, UseFilters } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { CareerService } from './career.service';
import { CreateCareerInput, UpdateCareerInput } from './career.dto';
import { UpdateCareerPipe } from '../lib/validatePipe/career/updateCareerPipe.class';

@Controller('career')
@ApiTags('Career')
@UseFilters(new HttpExceptionFilter())
export class CareerController {
  constructor(private careerService: CareerService) {}

  @Get('/all')
  async getAllBanner() {
    return await this.careerService.getAllCareer();
  }

  @Get('/:id')
  async getBanner(@Param('id', new CheckUUID()) id: string) {
    return await this.careerService.getCareer(id);
  }

  @Post()
  @ApiBody({ type: CreateCareerInput })
  async createCareer(@Body(new CreateCareerPipe()) createCareerInput: CreateCareerInput) {
    return await this.careerService.createCareer(createCareerInput);
  }

  @Put('/:id')
  @ApiBody({ type: UpdateCareerInput })
  async updateCareer(
    @Param('id', new CheckUUID()) id: string,
    @Body(new UpdateCareerPipe()) updateCareerInput: UpdateCareerInput,
  ) {
    return await this.careerService.updateCareer(id, updateCareerInput);
  }

  @Delete('/:id')
  async deleteCareer(@Param('id', new CheckUUID()) id: string) {
    return await this.careerService.deleteCareer(id);
  }
}
