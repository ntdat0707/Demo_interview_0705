import { ApiProperty } from '@nestjs/swagger';

export class CountryInput {
  @ApiProperty({ required: true })
  readonly name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly icon: string;
}

export class BranchInput {
  @ApiProperty({ required: true })
  readonly countryId: string;

  @ApiProperty({ required: true })
  readonly province: string;

  @ApiProperty({ required: true })
  readonly adress: string;

  @ApiProperty({ required: true })
  readonly contact: string;

  @ApiProperty({ required: false })
  readonly description: string;
}
