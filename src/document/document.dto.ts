import { ApiProperty } from '@nestjs/swagger';
import { EDocumentFlag, EResourceStatus } from '../lib/constant';

export class DocumentInput {
  @ApiProperty({ required: true, enum: Object.values(EResourceStatus) })
  readonly status: string;

  @ApiProperty({ required: true, type: 'string', format: 'binary' })
  readonly file: string;

  @ApiProperty({ required: true, enum: Object.values(EDocumentFlag) })
  readonly flag: string;
}

export class DocumentUpdateStatus {
  @ApiProperty({ required: true })
  readonly status: string;
}
