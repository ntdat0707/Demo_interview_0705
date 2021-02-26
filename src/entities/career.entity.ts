import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ECareerStatus, EEducationLevelStatus } from '../lib/constant';

@Entity('career')
export class CareerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('numeric', { name: 'vancancies', default: 0 })
  vancancies: number;

  @Column('varchar')
  country: string;

  @Column('varchar')
  city: string;

  @Column('varchar', { name: 'education_level', default: EEducationLevelStatus.NONE })
  educationLevel: string;

  @Column('numeric', { name: 'max_salary', default: 0 })
  maxSalary: number;

  @Column('numeric', { name: 'min_salary', default: 0 })
  minSalary: number;

  @Column('varchar')
  currency: string;

  @Column('boolean', { name: 'is_edit_salary', default: false })
  isEditSalary: boolean;

  @Column('varchar', { name: 'job_description' })
  jobDescription: string;

  @Column('varchar', { name: 'requirements_and_benefits', nullable: true })
  requirementsBenefits: string;

  @Column('varchar', { name: 'contact_information', nullable: true })
  contactInformation: string;

  @Column('varchar', { default: ECareerStatus.ACTIVE })
  status: string;

  @Column('date', { name: 'closing_date', nullable: true })
  closingDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.title = object.title;
    this.vancancies = object.vancancies ? object.vancancies : 0;
    this.country = object.country;
    this.city = object.city;
    this.educationLevel = object.educationLevel ? object.educationLevel : EEducationLevelStatus.NONE;
    this.maxSalary = object.maxSalary ? object.maxSalary : 0;
    this.minSalary = object.minSalary ? object.minSalary : 0;
    this.currency = object.currency;
    this.isEditSalary = object.isEditSalary ? object.isEditSalary : false;
    this.jobDescription = object.jobDescription;
    this.requirementsBenefits = object.requirementsBenefits ? object.requirementsBenefits : null;
    this.contactInformation = object.contactInformation ? object.contactInformation : null;
    this.status = object.status;
    this.closingDate = object.closingDate ? object.closingDate : null;
  }
}
