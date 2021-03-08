import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('focused_market_image')
export class FocusedImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('varchar', { nullable: true })
  alt: string;

  @Column('uuid', { name: 'focused_id' })
  focusedId: string;

  @Column('boolean', { name: 'is_avatar', default: false })
  isAvatar: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.focusedId = object.focusedId;
    this.alt = object.alt;
  }
}
