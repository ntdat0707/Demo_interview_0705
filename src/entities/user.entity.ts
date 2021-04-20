import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EUserStatus } from '../lib/constant';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  email: string;

  @Column({ name: 'user_name', type: 'varchar', nullable: true })
  userName: string;

  @Column('varchar', { name: 'full_name', nullable: false })
  fullName: string;

  @Column('text', { nullable: true })
  avatar: string;

  @Column('varchar', { nullable: false })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.email = object.email;
    this.userName = object.userName ? object.userName : object.fullName;
    this.fullName = object.fullName;
    this.avatar = object.avatar ? object.avatar : '';
    this.status = object.status ? object.status : EUserStatus.INACTIVE;
  }
}
