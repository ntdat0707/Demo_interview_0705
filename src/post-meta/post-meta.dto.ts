import { ApiProperty } from '@nestjs/swagger';

export class CreatePostMetaInput {
  @ApiProperty({ required: true })
  readonly key: string;

  @ApiProperty({ required: true })
  readonly value: number;

  @ApiProperty({ required: true })
  readonly postId: string;
}
