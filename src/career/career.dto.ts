import { ApiProperty } from '@nestjs/swagger';
import { EEducationLevelStatus, EResourceStatus } from '../lib/constant';

export class CreateCareerInput {
  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly vacancies: number;

  @ApiProperty({ required: true })
  readonly country: string;

  @ApiProperty({ required: true })
  readonly city: string;

  @ApiProperty({
    enum: Object.values(EEducationLevelStatus),
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

  @ApiProperty({ required: true, enum: Object.values(EResourceStatus) })
  readonly status: string;

  @ApiProperty({ type: Date, required: false })
  readonly closingDate: Date;
}

export class UpdateCareerInput {
  @ApiProperty({ required: false })
  readonly id: string;

  @ApiProperty({ required: true })
  readonly code: string;

  @ApiProperty({ required: true })
  readonly languageId: string;

  @ApiProperty({ required: true })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly vacancies: number;

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

  @ApiProperty({ required: true, enum: Object.values(EResourceStatus) })
  readonly status: string;

  @ApiProperty({ type: Date, required: false })
  readonly closingDate: Date;
}
