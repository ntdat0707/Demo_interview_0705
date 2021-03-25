import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateCatePipe } from '../lib/validatePipe/category/createCatePipe.class';
import { CheckUnSignIntPipe } from '../lib/validatePipe/checkIntegerPipe.class';
import { CategoryInput } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('Category')
@UseFilters(new HttpExceptionFilter())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post()
  @ApiBody({
    type: [CategoryInput],
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async createCate(@Body(new CreateCatePipe()) cateInput: [CategoryInput]) {
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
}
