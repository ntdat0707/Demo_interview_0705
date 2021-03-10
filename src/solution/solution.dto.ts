import { ApiProperty } from '@nestjs/swagger';

export class SolutionPictureInput {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly image: string;
}
class SolutionImage {
  @ApiProperty({ required: true })
  readonly image: string;
}

class AttachImage {
  @ApiProperty({ required: true })
  readonly image: string;
}

export class CreateSolutionInput {
  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ enum: ['publish', 'unpublish'] })
  readonly status: string;

  @ApiProperty({ type: Boolean, required: false })
  readonly isPublish: boolean;

  @ApiProperty({ type: Date, required: false })
  readonly publishDate: string;

  @ApiProperty({ required: false })
  readonly description?: string;

  @ApiProperty({ required: false })
  readonly bannerImage?: SolutionImage;

  @ApiProperty({ type: [AttachImage], required: false })
  readonly images?: AttachImage[];
}

export class UpdateSolutionInput {
  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: false })
  readonly title: string;

  @ApiProperty({ enum: ['publish', 'unpublish'] })
  readonly status: string;

  @ApiProperty({ type: Boolean, required: false })
  readonly isPublish: boolean;

  @ApiProperty({ type: Date, required: false })
  readonly publishDate: string;

  @ApiProperty({ required: false })
  readonly description?: string;

  @ApiProperty({ required: false })
  readonly bannerImage?: SolutionImage;

  @ApiProperty({ type: [AttachImage], required: false })
  readonly images?: AttachImage[];
}
