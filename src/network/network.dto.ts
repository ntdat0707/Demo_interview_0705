import { ApiProperty } from '@nestjs/swagger';

export class CountryInput {
  @ApiProperty({ required: true })
  readonly name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly image: string;
}

export class BranchInput {
  @ApiProperty({ required: true })
  readonly countryId: string;

  @ApiProperty({ required: true })
  readonly province: string;

  @ApiProperty({ required: true })
  readonly address: string;

  @ApiProperty({ required: true })
  readonly contact: string;

  @ApiProperty({ required: false })
  readonly description: string;
}
