import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseFilters } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateCatePipe } from '../lib/validatePipe/category/createCatePipe.class';
import { UpdateCatePipe } from '../lib/validatePipe/category/updateCatePipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
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
  async createCate(@Body(new CreateCatePipe()) cateInput: [CreateCategoryInput]) {
    return await this.categoryService.createCategory(cateInput);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'languageId', required: true })
  async getAllCategory(
    @Query('page', new CheckUnSignIntPipe()) page: number,
    @Query('limit', new CheckUnSignIntPipe()) limit: number,
    @Query('languageId') languageId: string,
  ) {
    return await this.categoryService.getAllCategory(page, limit, languageId);
  }

  @Get('/:code')
  async getCategory(@Param('code') code: string) {
    return await this.categoryService.getCategory(code);
  }

  @Put('/:code')
  @ApiBody({
    type: [UpdateCategoryInput],
  })
  async updateCate(@Param('code') code: string, @Body(new UpdateCatePipe()) cateInput: [UpdateCategoryInput]) {
    return await this.categoryService.updateCategory(code, cateInput);
  }

  @Delete('/:code')
  async DeleteCate(@Param('code') code: string) {
    return await this.categoryService.deleteCategory(code);
  }
}
