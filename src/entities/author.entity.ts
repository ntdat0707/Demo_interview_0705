import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('author')
export class AuthorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  email: string;

  @Column('varchar', { name: 'full_name' })
  fullName: string;

  @Column('varchar')
  phone: string;

  @Column('int2', { nullable: true })
  gender: number;

  @Column('varchar', { nullable: true })
  avatar: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.email = object.email;
    this.fullName = object.fullName;
    this.phone = object.phone;
    this.gender = object.gender;
    this.avatar = object.avatar;
  }
}
