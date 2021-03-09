import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { CreateLanguagePipe } from '../lib/validatePipe/language/createLanguagePipe.class';
import { LanguageInput } from './language.dto';
import { LanguageService } from './language.service';

@Controller('language')
@ApiTags('Language')
@UseFilters(new HttpExceptionFilter())
export class LanguageController {
  constructor(private languageService: LanguageService) {}
  @Post()
  @ApiBody({
    type: LanguageInput,
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([CREATE_BLOG, UPDATE_BLOG])
  async uploadImageBlog(@Body(new CreateLanguagePipe()) languageInput: LanguageInput) {
    return await this.languageService.createLanguage(languageInput);
  }
}
