import { ApiProperty } from '@nestjs/swagger';

export class CategoryInput {
  @ApiProperty({ required: true })
  readonly name: string;
}
