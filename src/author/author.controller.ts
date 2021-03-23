import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateAuthorPipe } from '../lib/validatePipe/author/createAuthorPipe.class';
import { AuthorInput } from './author.dto';
import { AuthorService } from './author.service';

@Controller('author')
@ApiTags('Author')
@UseFilters(new HttpExceptionFilter())
export class AuthorController {
  constructor(private authorService: AuthorService) {}
  @Post()
  @ApiBody({
    type: AuthorInput,
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async createCate(@Body(new CreateAuthorPipe()) authorInput: AuthorInput) {
    return await this.authorService.createAuthor(authorInput);
  }

  @Get()
  async getAllAuthor() {
    return await this.authorService.getAllAuthor();
  }
}
