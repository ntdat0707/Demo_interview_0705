import { ApiProperty } from '@nestjs/swagger';

export class CreatePostInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: true })
  readonly content: string;
}

export class UpdatePostInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: true })
  readonly content: string;
}
