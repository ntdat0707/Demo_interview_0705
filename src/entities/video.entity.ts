import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('video')
export class VideoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('varchar')
  flag: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  video: string;

  @Column('text', { name: 'link_video', nullable: true })
  linkVideo: string;

  @Column('varchar')
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.title = object.title;
    this.description = object.description;
    this.video = object.video;
    this.linkVideo = object.linkVideo;
    this.status = object.status;
  }
}
