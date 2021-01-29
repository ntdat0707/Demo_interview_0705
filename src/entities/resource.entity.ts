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

  @Column('boolean', { name: 'is_publish', default: false })
  isPublish: boolean;

  @Column('timestamptz', { name: 'publish_date', nullable: true })
  publishDate: Date;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { name: 'is_edit_seo', default: false })
  isEditSEO: boolean;

  @Column('varchar', { name: 'title_seo', nullable: true })
  titleSEO: string;

  @Column('varchar', { name: 'description_seo', nullable: true })
  descriptionSEO: string;

  @Column('text', { nullable: true })
  link: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.title = object.title;
    this.status = object.status;
    this.isPublish = object.isPublish;
    this.publishDate = object.publishDate;
    this.description = object.description;
    this.isEditSEO = object.isEditSEO;
    this.titleSEO = object.titleSEO;
    this.descriptionSEO = object.descriptionSEO;
    this.link = object.link;
  }
}
