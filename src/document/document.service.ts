import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { DocumentEntity } from '../entities/document.entity';
import { EDocmentFlag } from '../lib/constant';
import { DocumentInput, DocumentUpdateStatus } from './document.dto';
import fs = require('fs');

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
    const lastName = fileName.split('.');
    const name = fileName.substring(0, fileName.lastIndexOf('_')) + '.' + lastName[lastName.length - 1];
    let pathFile = '';

    let newDocument = new DocumentEntity();
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      if (documentInput.flag === EDocmentFlag.ABOUT_US || documentInput.flag === EDocmentFlag.RESOURCE) {
        const document = await this.documentRepository.findOne({ where: { flag: documentInput.flag } });
        if (document) {
          await transactionalEntityManager.softRemove<DocumentEntity>(document);
        }
      } else {
        const existDocument = await this.documentRepository.findOne({
          where: { name: name, flag: documentInput.flag },
        });
        if (existDocument) {
          pathFile = process.env.UPLOAD_DOCUMENT_PATH + '/' + existDocument.file;
          await this.documentRepository.delete(existDocument);
        }
      }
      newDocument.setAttributes(documentInput);
      newDocument.file = fileName;
      newDocument.name = name;
      await this.connection.queryResultCache.clear();
      newDocument = await transactionalEntityManager.save<DocumentEntity>(newDocument);
    });
    if (pathFile !== '') {
      fs.unlinkSync(pathFile);
    }
    return {
      data: newDocument,
    };
  }

  async getAllDocument(flag: string, page = 1, limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10)) {
    this.logger.debug('get all document');
    const queryExc = this.documentRepository
      .createQueryBuilder('document')
      .orderBy('created_at', 'DESC')
      .where(`flag =  :value`, { value: `${flag}` })
      .limit(limit)
      .offset((page - 1) * limit);
    const countResult = await queryExc.cache(`documents_count_page${page}_limit${limit}`).getCount();
    const result = await queryExc.cache(`documents__page${page}_limit${limit}`).getMany();
    const pages = Math.ceil(Number(countResult) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: countResult,
      data: result,
    };
  }

  async updateStatusDocument(id: string, documentUpdate: DocumentUpdateStatus) {
    this.logger.debug('update status document');
    let document = await this.documentRepository.findOne({ where: { id: id } });
    if (!document) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'DOCUMENT_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    document.status = documentUpdate.status;
    await this.connection.queryResultCache.clear();
    document = await this.documentRepository.save(document);
    return {
      data: document,
    };
  }

  async deleteDocument(id: string) {
    this.logger.debug('delete document');
    const document = await this.documentRepository.findOne({ where: { id: id } });
    if (!document) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'DOCUMENT_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await this.documentRepository.softDelete(document);
    return {};
  }

  async getDocument(id: string) {
    this.logger.debug('get document');
    const document = await this.documentRepository.findOne({ where: { id: id } });
    if (!document) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'DOCUMENT_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: document,
    };
  }
}
