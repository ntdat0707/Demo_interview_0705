import { ApiProperty } from '@nestjs/swagger';
import { EBannerStatus } from '../lib/constant';

export class AgentInput {
  @ApiProperty()
  readonly companyPhone: string;

  @ApiProperty()
  readonly companyName: string;

  @ApiProperty()
  readonly website: string;

  @ApiProperty()
  readonly companyEmail: string;

  @ApiProperty()
  readonly country: string;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly street: string;

  @ApiProperty()
  readonly contactName: string;

  @ApiProperty()
  readonly contactEmail: string;

  @ApiProperty()
  readonly contactPhone: string;

  @ApiProperty()
  readonly jobTitle: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty({
    enum: [...Object.values(EBannerStatus)],
  })
  readonly status: string;
}
