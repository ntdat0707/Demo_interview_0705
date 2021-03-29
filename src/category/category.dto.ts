import { ApiProperty } from '@nestjs/swagger';
import { ECategoryType, EResourceStatus } from '../lib/constant';

export class CreateCategoryInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly link: string;

  @ApiProperty({ required: true, enum: Object.values(EResourceStatus) })
  readonly status: string;

  @ApiProperty({ required: true, enum: Object.values(ECategoryType) })
  readonly type: string;
}
export class UpdateCategoryInput {
  @ApiProperty({ required: false })
  readonly id: string;

  @ApiProperty({ required: true })
  readonly code: string;

  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly link: string;

  @ApiProperty({ required: true, enum: Object.values(EResourceStatus) })
  readonly status: string;

  @ApiProperty({ required: true, enum: Object.values(ECategoryType) })
  readonly type: string;
}
