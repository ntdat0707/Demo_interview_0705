import { ApiProperty } from '@nestjs/swagger';
export class LanguageInput {
  @ApiProperty({ required: true })
  readonly id: string;

  @ApiProperty({ required: true })
  readonly name: string;
}
