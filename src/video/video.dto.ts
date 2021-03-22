import { ApiProperty } from '@nestjs/swagger';
import { EFlagUploadVideo, EResourceStatus } from '../lib/constant';

export class VideoInput {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly video: string;
}
export class UploadVideoInput {
  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly video: string;

  @ApiProperty({ required: false })
  readonly linkVideo: string;

  @ApiProperty({ required: true, enum: Object.values(EResourceStatus) })
  readonly status: string;

  @ApiProperty({ required: true, enum: Object.values(EFlagUploadVideo) })
  readonly flag: string;
}

export class UpdateVideoInput {
  @ApiProperty({ required: false })
  readonly id: string;

  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly code: string;

  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly video: string;

  @ApiProperty({ required: false })
  readonly linkVideo: string;

  @ApiProperty({ required: true, enum: Object.values(EResourceStatus) })
  readonly status: string;

  @ApiProperty({ required: true, enum: Object.values(EFlagUploadVideo) })
  readonly flag: string;
}
