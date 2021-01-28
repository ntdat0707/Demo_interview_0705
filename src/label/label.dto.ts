import { ApiProperty } from '@nestjs/swagger';

export class LabelInput {
  @ApiProperty({ required: true })
  readonly name: string;
}
