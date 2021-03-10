import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { DocumentEntity } from '../entities/document.entity';
import { EDocmentFlag } from '../lib/constant';
import { DocumentInput } from './document.dto';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    private connection: Connection,
  ) {}

  async uploadDocument(file: any, documentInput: DocumentInput) {
    this.logger.debug('upload document');
    const fileName: string = file.filename;
    const name = fileName.substring(0, fileName.lastIndexOf('_'));
    let newDocument = new DocumentEntity();
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      if (documentInput.flag === EDocmentFlag.ABOUT_US || documentInput.flag === EDocmentFlag.RESOURCE) {
        const document = await this.documentRepository.findOne({ where: { flag: documentInput.flag } });
        if (document) {
          await transactionalEntityManager.softRemove<DocumentEntity>(document);
        }
      } else {
        const existDocument = await this.documentRepository.findOne({ where: { name: name } });
        if (existDocument) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              message: 'DOCUMENT_NAME_EXIST',
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      newDocument.setAttributes(documentInput);
      newDocument.file = fileName;
      newDocument.name = name;
      newDocument = await transactionalEntityManager.save<DocumentEntity>(newDocument);
    });
    return {
      data: newDocument,
    };
  }
}
