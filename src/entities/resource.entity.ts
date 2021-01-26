import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EResourceStatus } from '../lib/constant';

@Entity('resource')
export class ResourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('varchar', { default: EResourceStatus.UNPUBLISH })
  status: string;

  @Column('boolean', { default: false })
  isPublish: boolean;

  @Column('timestamptz', { nullable: true })
  publishDate: Date;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { default: false })
  isEditSEO: boolean;

  @Column('varchar', { nullable: true })
  titleSEO: string;

  @Column('varchar', { nullable: true })
  descriptionSEO: string;

  @Column('text', { nullable: true })
  link: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    if (object.title) this.title = object.title;
    if (object.status !== undefined) this.status = object.status;
    if (object.isPublish === true || object.isPublish === false) this.isPublish = object.isPublish;
    if (object.publishDate || object.publishDate === null) this.publishDate = object.publishDate;
    if (object.description || object.description === null) this.description = object.description;
    if (object.isEditSEO === true || object.isEditSEO === false) this.isEditSEO = object.isEditSEO;
    if (object.titleSEO || object.titleSEO === null) this.titleSEO = object.titleSEO;
    if (object.descriptionSEO || object.descriptionSEO === null) this.descriptionSEO = object.descriptionSEO;
    if (object.link || object.link === null) this.link = object.link;
  }
}
