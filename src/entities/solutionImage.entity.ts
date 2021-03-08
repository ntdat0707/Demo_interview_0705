import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('solution_image')
export class SolutionImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('varchar', { nullable: true })
  alt: string;

  @Column('uuid', { name: 'solution_id' })
  solutionId: string;

  @Column('boolean', { name: 'is_avatar', default: false })
  isAvatar: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.solutionId = object.solutionId;
    this.alt = object.alt;
  }
}
