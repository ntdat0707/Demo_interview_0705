import { ApiProperty } from '@nestjs/swagger';

export class BannerInput {
  @ApiProperty({ required: false })
  readonly id: string;

  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ required: false })
  readonly textColor: string;

  @ApiProperty({ required: false })
  readonly image: string;

  @ApiProperty({ required: false })
  readonly imageAlt: string;

  @ApiProperty({ required: false })
  readonly imageForResponsive: string;

  @ApiProperty({ required: false })
  readonly imageAltForResponsive: string;

  @ApiProperty({ required: false })
  readonly link: string;

  @ApiProperty({ required: false })
  readonly position: string;

  @ApiProperty({ required: false })
  readonly status: string;

  @ApiProperty({ type: Date, format: 'date', required: false })
  readonly validFrom: Date;

  @ApiProperty({ type: Date, format: 'date', required: false })
  readonly validTo: Date;
}

export class ImageBannerInput {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  readonly image: string;
}

export class BannerIndexInput {
  @ApiProperty({ required: true })
  readonly code: string;

  @ApiProperty({ required: true })
  readonly index: number;
}
