import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EResourceStatus } from '../lib/constant';

@Entity('focused_market')
export class FocusedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'language_id', type: 'uuid' })
  languageId: string;

  @Column('varchar')
  title: string;

  @Column({ name: 'feature_image', type: 'text', nullable: true })
  featureImage: string;

  @Column('varchar', { default: EResourceStatus.UNPUBLISH })
  status: string;

  @Column('boolean', { name: 'is_publish', default: false })
  isPublish: boolean;

  @Column('timestamptz', { name: 'publish_date', nullable: true })
  publishDate: Date;

  @Column('varchar', { name: 'description', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.languageId = object.languageId;
    this.title = object.title;
    this.featureImage = object.featureImage ? object.featureImage : null;
    this.status = object.status;
    this.isPublish = object.isPublish ? object.isPublish : false;
    this.publishDate = object.publishDate ? object.publishDate : null;
    this.description = object.description ? object.description : null;
  }
}
