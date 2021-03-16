import { ApiProperty } from '@nestjs/swagger';
import { EResourceStatus } from '../lib/constant';

export class SolutionPictureInput {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly image: string;
}
class AttachImage {
  @ApiProperty({ required: true })
  readonly image: string;
}

export class FocusedMarketInput {
  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ enum: Object.values(EResourceStatus), required: true })
  readonly status: string;

  @ApiProperty({ type: Boolean, required: true })
  readonly isPublish: boolean;

  @ApiProperty({ type: Date, required: false })
  readonly publishDate: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ required: false })
  readonly featureImage: string;

  @ApiProperty({ type: [AttachImage], required: false })
  readonly images: AttachImage[];
}

export class UploadFocusedMarketInput {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly image: string;
}
