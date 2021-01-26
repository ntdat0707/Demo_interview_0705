import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EBannerStatus } from '../lib/constant';

@Entity('banner')
export class BannerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  textColor: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('varchar', { nullable: true })
  imageAlt: string;

  @Column('text', { nullable: true })
  link: string;

  @Column('varchar', { default: 'homepage' })
  position: string;

  @Column('varchar', { default: EBannerStatus.ACTIVE })
  status: string;

  @Column('date', { nullable: true })
  validFrom: Date;

  @Column('date', { nullable: true })
  validTo: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    if (object.title) this.title = object.title;
    if (object.description) this.description = object.description;
    if (object.textColor) this.textColor = object.textColor;
    if (object.image) this.image = object.image;
    if (object.imageAlt) this.imageAlt = object.imageAlt;
    if (object.link) this.link = object.link;
    if (object.position) this.position = object.position;
    if (object.status) this.status = object.status;
    if (object.validFrom) this.validFrom = object.validFrom;
    if (object.validTo) this.validTo = object.validTo;
  }
}
