import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'language_id', nullable: false })
  languageId: string;

  @Column('varchar', { name: 'title', nullable: false })
  title: string;

  @Column('varchar', { name: 'link', nullable: false })
  link: string;

  @Column('varchar', { name: 'code', nullable: false })
  code: string;

  @Column('varchar', { name: 'status', nullable: false })
  status: string;

  @Column('varchar', { name: 'type', nullable: false })
  type: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.title = object.title;
    this.link = object.link;
    this.languageId = object.languageId;
    this.type = object.type;
  }
}
