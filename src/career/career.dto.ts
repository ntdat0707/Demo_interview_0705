import { ApiProperty } from '@nestjs/swagger';

export class CreateCareerInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly vancancies: number;

  @ApiProperty({ required: true })
  readonly country: string;

  @ApiProperty({ required: true })
  readonly city: string;

  @ApiProperty({
    enum: [
      'any_level',
      'high_school_or_equivalent',
      'associate_degree',
      'bachelor_degree',
      'master_degree',
      'doctorate_degree',
      'none',
    ],
    required: false,
  })
  readonly educationLevel: string;

  @ApiProperty({ required: false })
  readonly maxSalary: number;

  @ApiProperty({ required: false })
  readonly minSalary: number;

  @ApiProperty({ required: true })
  readonly currency: string;

  @ApiProperty({ required: false })
  readonly isEditSalary: boolean;

  @ApiProperty({ required: true })
  readonly jobDescription: string;

  @ApiProperty({ required: false })
  readonly requirementsBenefits: string;

  @ApiProperty({ required: false })
  readonly contactInformation: string;

  @ApiProperty({ enum: ['active', 'closed'], required: false })
  readonly status: string;

  @ApiProperty({ type: Date, required: false })
  readonly closingDate: Date;
}

export class UpdateCareerInput {
  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly vancancies: number;

  @ApiProperty({ required: true })
  readonly country: string;

  @ApiProperty({ required: true })
  readonly city: string;

  @ApiProperty({
    enum: [
      'any_level',
      'high_school_or_equivalent',
      'associate_degree',
      'bachelor_degree',
      'master_degree',
      'doctorate_degree',
      'none',
    ],
    required: false,
  })
  readonly educationLevel: string;

  @ApiProperty({ required: false })
  readonly maxSalary: number;

  @ApiProperty({ required: false })
  readonly minSalary: number;

  @ApiProperty({ required: true })
  readonly currency: string;

  @ApiProperty({ required: false })
  readonly isEditSalary: boolean;

  @ApiProperty({ required: false })
  readonly jobDescription: string;

  @ApiProperty({ required: false })
  readonly requirementsBenefits: string;

  @ApiProperty({ required: false })
  readonly contactInformation: string;

  @ApiProperty({ enum: ['active', 'closed'], required: false })
  readonly status: string;

  @ApiProperty({ type: Date, required: false })
  readonly closingDate: Date;
}
