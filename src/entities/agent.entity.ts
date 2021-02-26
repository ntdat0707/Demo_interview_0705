import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EBannerStatus } from '../lib/constant';

@Entity('agent')
export class AgentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  code: string;

  @Column('varchar', { name: 'company_phone' })
  companyPhone: string;

  @Column('varchar', { name: 'company_name' })
  companyName: string;

  @Column('varchar', { nullable: true })
  website: string;

  @Column('varchar', { name: 'company_email', nullable: true })
  companyEmail: string;

  @Column('varchar')
  country: string;

  @Column('varchar')
  city: string;

  @Column('varchar')
  street: string;

  @Column('varchar', { name: 'contact_name' })
  contactName: string;

  @Column('varchar', { name: 'contact_email' })
  contactEmail: string;

  @Column('varchar', { name: 'contact_phone' })
  contactPhone: string;

  @Column('varchar', { name: 'job_title', nullable: true })
  jobTitle: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('varchar', { default: EBannerStatus.ACTIVE })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.companyPhone = object.companyPhone;
    this.companyName = object.companyName;
    this.website = object.website ? object.website : null;
    this.companyEmail = object.companyEmail ? object.companyEmail : null;
    this.country = object.country;
    this.city = object.city;
    this.street = object.street;
    this.contactName = object.contactName;
    this.contactEmail = object.contactEmail;
    this.contactPhone = object.contactPhone;
    this.jobTitle = object.jobTitle ? object.jobTitle : null;
    this.description = object.description ? object.description : null;
    this.status = object.status;
  }
}
