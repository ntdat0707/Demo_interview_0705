import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LanguageInput } from '../../../language/language.dto';

@Injectable()
export class CreateLanguagePipe implements PipeTransform<any> {
  transform(value: LanguageInput, metadata: ArgumentMetadata) {
    if (!value.name) {
      throw new BadRequestException('NAME_REQUIRED');
    }
    if (!value.code) {
      throw new BadRequestException('CODE_REQUIRED');
    }
    if (!value.image) {
      throw new BadRequestException('IMAGE_REQUIRED');
    }
    return value;
  }
}
