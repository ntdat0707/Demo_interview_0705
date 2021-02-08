import { CreateCareerPipe } from './../lib/validatePipe/career/createCareerPipe.class';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseFilters } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { CareerService } from './career.service';
import { CreateCareerInput, UpdateCareerInput } from './career.dto';
import { UpdateCareerPipe } from '../lib/validatePipe/career/updateCareerPipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';

@Controller('career')
@ApiTags('Career')
@UseFilters(new HttpExceptionFilter())
export class CareerController {
  constructor(private careerService: CareerService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'searchValue', required: false, type: String, isArray: true })
  async getAllCareer(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('status') status: string,
    @Query('country') country: string,
    @Query('searchValue') searchValue: string,
  ) {
    return await this.careerService.getAllCareer(page, limit, searchValue, status, country);
  }

  @Get('/:id')
  async getCareer(@Param('id', new CheckUUID()) id: string) {
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
