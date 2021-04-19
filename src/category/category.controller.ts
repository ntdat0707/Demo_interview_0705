import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseFilters } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateCatePipe, StatusCatePipe } from '../lib/validatePipe/category/createCatePipe.class';
import { UpdateCatePipe } from '../lib/validatePipe/category/updateCatePipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CheckStatusPipe } from '../lib/validatePipe/checkStatusPipe.class';
import { CreateCategoryInput, UpdateCategoryInput } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('Category')
@UseFilters(new HttpExceptionFilter())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @ApiBody({
    type: [CreateCategoryInput],
  })
  @ApiQuery({ name: 'status', required: true })
  async createCate(
    @Body(new CreateCatePipe()) cateInput: [CreateCategoryInput],
    @Query('status', new StatusCatePipe()) status: string,
  ) {
    return await this.categoryService.createCategory(cateInput, status);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: true })
  @ApiQuery({ name: 'languageId', required: false })
  @ApiQuery({ name: 'status', type: String, required: false })
  async getAllCategory(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('type') type: string,
    @Query('languageId') languageId: string,
    @Query('status', new CheckStatusPipe()) status: string,
  ) {
    return await this.categoryService.getAllCategory(page, limit, type, languageId, status);
  }

  @Get('/:code')
  @ApiQuery({ name: 'languageId', required: false })
  async getCategory(@Param('code') code: string, @Query('languageId') languageId: string) {
    return await this.categoryService.getCategory(code, languageId);
  }

  @Put('/:code')
  @ApiBody({
    type: [UpdateCategoryInput],
  })
  @ApiQuery({ name: 'status', required: true })
  async updateCate(
    @Param('code') code: string,
    @Body(new UpdateCatePipe()) cateInput: [UpdateCategoryInput],
    @Query('status', new StatusCatePipe()) status: string,
  ) {
    return await this.categoryService.updateCategory(code, cateInput, status);
  }

  @Delete('/:code')
  async DeleteCate(@Param('code') code: string) {
    return await this.categoryService.deleteCategory(code);
  }
}
