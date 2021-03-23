import { ApiProperty } from '@nestjs/swagger';
import { EAgentCreatedOn, EBannerStatus } from '../lib/constant';

export class AgentInput {
  @ApiProperty({ required: true })
  readonly companyPhone: string;

  @ApiProperty({ enum: [...Object.values(EAgentCreatedOn)] })
  readonly createdOn: string;

  @ApiProperty({ required: true })
  readonly companyName: string;

  @ApiProperty({ required: false })
  readonly website: string;

  @ApiProperty({ required: false })
  readonly companyEmail: string;

  @ApiProperty({ required: true })
  readonly country: string;

  @ApiProperty({ required: true })
  readonly city: string;

  @ApiProperty({ required: true })
  readonly street: string;

  @ApiProperty({ required: true })
  readonly contactName: string;

  @ApiProperty({ required: true })
  readonly contactEmail: string;

  @ApiProperty({ required: true })
  readonly contactPhone: string;

  @ApiProperty({ required: false })
  readonly jobTitle: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({
    enum: [...Object.values(EBannerStatus)],
  })
  readonly status: string;
}
