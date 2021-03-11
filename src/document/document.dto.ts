import { ApiProperty } from '@nestjs/swagger';

export class DocumentInput {
  @ApiProperty({ required: true })
  readonly status: string;

  @ApiProperty({ required: true, type: 'string', format: 'binary' })
  readonly file: string;

  @ApiProperty({ required: true })
  readonly flag: string;
}

export class DocumentUpdateStatus {
  @ApiProperty({ required: true })
  readonly status: string;
}
