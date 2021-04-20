import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('post_meta')
export class PostMetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  key: string;

  @Column('integer')
  value: number;

  @Column('uuid', { name: 'post_id', nullable: false })
  postId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.key = object.key;
    this.value = object.value;
    this.postId = object.postId;
  }
}
