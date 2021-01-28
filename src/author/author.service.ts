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

  async createAuthor(input: AuthorInput) {
    this.logger.debug('create author');
    //check author
    // let newAuthor = new AuthorEntity();
  }
}
