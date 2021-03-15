import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageEntity } from '../entities/language.entity';
import { LanguageInput } from './language.dto';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(LanguageService.name);
  constructor(
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
  ) {}
  async createLanguage(languageInput: LanguageInput) {
    this.logger.debug('create language');
    const language = new LanguageEntity();
    language.setAttributes(languageInput);
    await this.languageRepository.save(language);
    return {
      data: language,
    };
  }

  async getAllLanguage() {
    this.logger.debug('get language');
    //check author
    const languages = await this.languageRepository.find();
    return {
      data: languages,
    };
  }

  async getLanguage(id: string) {
    this.logger.debug('get language');
    const language = await this.languageRepository.find({ id: id });
    return {
      data: language,
    };
  }
}
