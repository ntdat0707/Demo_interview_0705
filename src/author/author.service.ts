import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorEntity } from '../entities/author.entity';
import { AuthorInput } from './author.dto';

@Injectable()
export class AuthorService {
  private readonly logger = new Logger(AuthorService.name);
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) {}

  async createAuthor(authorInput: AuthorInput) {
    this.logger.debug('create author');
    //check author
    const newAuthor = new AuthorEntity();
    newAuthor.setAttributes(authorInput);
    await this.authorRepository.save(newAuthor);
    return {
      data: {
        label: newAuthor,
      },
    };
  }

  async getAllAuthor() {
    this.logger.debug('get all author');
    const authors = await this.authorRepository.find({});
    return {
      data: authors,
    };
  }
}
