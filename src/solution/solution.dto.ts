import { ApiProperty } from '@nestjs/swagger';

export class SolutionPictureInput {
  @ApiProperty({ type: 'string', format: 'binary' })
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
  readonly bannerImage?: string;
}

export class UpdateSolutionInput {
  @ApiProperty({ required: true })
  readonly id: string;

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
  readonly bannerImage?: string;
}
