import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EResourceStatus } from '../lib/constant';

@Entity('resource')
export class ResourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('varchar', { nullable: true })
  author: string;

  @Column('varchar', { default: EResourceStatus.UNPUBLISH })
  status: string;

  @Column('boolean', { name: 'is_publish', default: false })
  isPublish: boolean;

  @Column('timestamptz', { name: 'publish_date', nullable: true })
  publishDate: Date;

  @Column('text', { name: 'avatar', nullable: true })
  avatar: string;

  @Column('varchar', { name: 'short_description', nullable: true })
  shortDescription: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('boolean', { name: 'is_edit_seo', default: false })
  isEditSEO: boolean;

  @Column('varchar', { name: 'title_seo', nullable: true })
  titleSEO: string;

  @Column('varchar', { name: 'description_seo', nullable: true })
  descriptionSEO: string;

  @Column('text', { nullable: true })
  link: string;

  @Column('varchar', { name: 'language_id', nullable: false })
  languageId: string;

  @Column('varchar', { nullable: true })
  code: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  @Column('integer', { default: 0, nullable: false })
  views: number;

  setAttributes(object: any) {
    this.title = object.title;
    this.author = object.author ? object.author : null;
    this.status = object.status;
    this.isPublish = object.isPublish ? object.isPublish : false;
    this.publishDate = object.publishDate ? object.publishDate : null;
    this.shortDescription = object.shortDescription ? object.shortDescription : null;
    this.description = object.description ? object.description : null;
    this.isEditSEO = object.isEditSEO ? object.isEditSEO : false;
    this.titleSEO = object.titleSEO ? object.titleSEO : null;
    this.descriptionSEO = object.descriptionSEO ? object.descriptionSEO : null;
    this.link = object.link ? object.link : null;
    this.languageId = object.languageId;
    this.avatar = object.avatar ? object.avatar : null;
  }
}
