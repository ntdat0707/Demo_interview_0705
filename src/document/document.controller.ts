import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exception/httpException.filter';
import { DocumentPipe } from '../lib/validatePipe/document/documentPipe.class';
import { DocumentStatusPipe } from '../lib/validatePipe/document/documentSatusPipe.class';
import { CheckUUID } from '../lib/validatePipe/uuidPipe.class';
import { CheckFlagPipe } from '../lib/validatePipe/video/checkQueryStringPipe.class';
import { DocumentInput, DocumentUpdateStatus } from './document.dto';
import { DocumentService } from './document.service';

@Controller('document')
@ApiTags('Document')
@UseFilters(new HttpExceptionFilter())
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Get('')
  @ApiQuery({ name: 'flag', required: true, type: String })
  async getAllDocument(@Query('flag', new CheckFlagPipe()) flag: string) {
    return await this.documentService.getAllDocument(flag);
  }

  @Get('/:id')
  async getDocument(@Param('id', new CheckUUID()) id: string) {
    return await this.documentService.getDocument(id);
  }

  @Post('')
  @ApiBody({ type: DocumentInput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file: any, @Body(new DocumentPipe()) documentInput: DocumentInput) {
    return await this.documentService.uploadDocument(file, documentInput);
  }

  @Put('/id')
  @ApiBody({ type: DocumentUpdateStatus })
  async updateDocumentStatus(
    @Param('id', new CheckUUID()) id: string,
    @Body(new DocumentStatusPipe()) documentUpdateStatus: DocumentUpdateStatus,
  ) {
    return await this.documentService.updateStatusDocument(id, documentUpdateStatus);
  }

  @Delete('/:id')
  async deleteDocument(@Param('id', new CheckUUID()) id: string) {
    return await this.documentService.deleteDocument(id);
  }
}
