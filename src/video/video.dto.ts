import { ApiProperty } from '@nestjs/swagger';

export class UploadVideoInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly video: string;

  @ApiProperty({ required: false })
  readonly linkVideo: string;

  @ApiProperty({ required: true })
  readonly status: string;

  @ApiProperty({ required: true })
  readonly flag: string;
}

export class UpdateVideoInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly video: string;

  @ApiProperty({ required: false })
  readonly linkVideo: string;

  @ApiProperty({ required: true })
  readonly status: string;
}
