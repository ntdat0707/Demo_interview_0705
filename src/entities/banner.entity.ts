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
    this.title = object.title;
    this.description = object.description;
    this.textColor = object.textColor;
    this.image = object.image;
    this.imageAlt = object.imageAlt;
    this.link = object.link;
    this.position = object.position;
    this.status = object.status;
    this.validFrom = object.validFrom;
    this.validTo = object.validTo;
  }
}
