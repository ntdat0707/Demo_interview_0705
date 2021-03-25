import { ApiProperty } from '@nestjs/swagger';

export class CategoryInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly link: string;
}
