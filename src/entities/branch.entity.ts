import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('branch')
export class BranchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'country_id', type: 'uuid' })
  countryId: string;

  @Column('varchar')
  province: string;

  @Column('varchar')
  address: string;

  @Column('varchar')
  contact: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true, select: false })
  deletedAt: Date;

  setAttributes(object: any) {
    this.countryId = object.countryId;
    this.province = object.province;
    this.address = object.address;
    this.contact = object.contact;
    this.description = object.description ? object.description : null;
  }
}
