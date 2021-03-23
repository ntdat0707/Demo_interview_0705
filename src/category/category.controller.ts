import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateCatePipe } from '../lib/validatePipe/category/createCatePipe.class';
import { CategoryInput } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('Category')
@UseFilters(new HttpExceptionFilter())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post()
  @ApiBody({
    type: CategoryInput,
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async createCate(@Body(new CreateCatePipe()) cateInput: CategoryInput) {
    return await this.categoryService.createCategory(cateInput);
  }

  @Get()
  async getAllCategory() {
    return await this.categoryService.getAllCategory();
  }
}
