import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_meta')
export class UserMetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  key: string;

  @Column({ type: 'integer', default: 0 })
  value: number;

  @Column('uuid', { name: 'user_id', nullable: false })
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.key = object.key;
    this.value = object.value;
    this.userId = object.userId;
  }
}
