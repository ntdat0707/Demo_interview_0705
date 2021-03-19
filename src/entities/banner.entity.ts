import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EBannerStatus } from '../lib/constant';

@Entity('banner')
export class BannerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'language_id', type: 'uuid' })
  languageId: string;

  @Column('varchar')
  title: string;

  @Column('varchar')
  code: string;

  @Column({ default: 0, nullable: true })
  index: number;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('text', { name: 'text_color', nullable: true })
  textColor: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('varchar', { name: 'image_alt', nullable: true })
  imageAlt: string;

  @Column('text', { name: 'image_for_responsive', nullable: true })
  imageForResponsive: string;

  @Column('varchar', { name: 'image_alt_for_responsive', nullable: true })
  imageAltForResponsive: string;

  @Column('text', { nullable: true })
  link: string;

  @Column('varchar', { default: 'homepage' })
  position: string;

  @Column('varchar', { default: EBannerStatus.ACTIVE })
  status: string;

  @Column('date', { name: 'valid_from', nullable: true })
  validFrom: Date;

  @Column('date', { name: 'valid_to', nullable: true })
  validTo: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.languageId = object.languageId;
    this.title = object.title;
    this.description = object.description ? object.description : null;
    this.textColor = object.textColor ? object.textColor : null;
    this.image = object.image ? object.image : null;
    this.imageAlt = object.imageAlt ? object.imageAlt : null;
    this.imageForResponsive = object.imageForResponsive ? object.imageForResponsive : null;
    this.imageAltForResponsive = object.imageAltForResponsive ? object.imageAltForResponsive : null;
    this.link = object.link ? object.link : null;
    this.position = object.position ? object.position : null;
    this.status = object.status;
    this.validFrom = object.validFrom ? object.validFrom : null;
    this.validTo = object.validTo ? object.validTo : null;
  }
}
