import { ApiProperty } from '@nestjs/swagger';

export class AuthorInput {
  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: false })
  readonly fullName: string;

  @ApiProperty({ required: false })
  readonly phone: string;

  @ApiProperty({ type: 'integer', default: 0 })
  readonly gender: number; // 0 : unisex , 1: female, 2: male

  @ApiProperty({ required: false })
  readonly avatar: string;
}
