import { ApiProperty } from '@nestjs/swagger';

export class UserMetaInput {
  @ApiProperty({ required: true })
  readonly key: string;

  @ApiProperty({ required: true })
  readonly value: number;

  @ApiProperty({ required: true })
  readonly userId: string;
}
