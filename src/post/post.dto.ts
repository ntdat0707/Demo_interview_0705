import { ApiProperty } from '@nestjs/swagger';

export class CreatePostInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: true })
  readonly content: string;

  @ApiProperty({ required: false })
  readonly userId: string;
}

export class UpdatePostInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: true })
  readonly content: string;

  @ApiProperty({ required: false })
  readonly userId: string;
}
