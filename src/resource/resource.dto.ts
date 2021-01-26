import { ApiProperty } from '@nestjs/swagger';

export class ResourcePicture {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly resourcePicture: string;
}

export class CreateResourceInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ enum: ['publish', 'unpublish'] })
  readonly status: string;

  @ApiProperty({ type: Boolean, required: false })
  readonly isPublish: number;

  @ApiProperty({ type: Date, required: false })
  readonly publishDate: string;

  @ApiProperty({ required: false })
  readonly description?: string;

  @ApiProperty({ type: Boolean, required: false })
  readonly isEditSEO: string;

  @ApiProperty({ required: false })
  readonly titleSEO: string;

  @ApiProperty({ nullable: true })
  readonly descriptionSEO: boolean;

  @ApiProperty({ type: 'text', required: false })
  readonly link: string;

  @ApiProperty({ type: [String], required: false })
  readonly categoryIds?: string[];

  @ApiProperty({ required: false })
  readonly authorId: string;

  @ApiProperty({ type: [String], required: false })
  readonly labelIds?: string[];

  @ApiProperty({ required: false })
  readonly alt: string;
}
