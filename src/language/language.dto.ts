import { ApiProperty } from '@nestjs/swagger';
export class LanguageInput {
  @ApiProperty({ required: true })
  readonly name: string;

  @ApiProperty({ required: true })
  readonly code: string;
}
