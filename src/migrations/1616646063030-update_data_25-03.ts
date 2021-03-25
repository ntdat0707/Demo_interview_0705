import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateData25031616646063030 implements MigrationInterface {
  name = 'updateData25031616646063030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agent" ADD "is_send_mail" boolean NOT NULL`);
    await queryRunner.query(`ALTER TABLE "language" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "language" ADD "image" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "video" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "video" ADD "code" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "image"`);
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "agent" DROP COLUMN "is_send_mail"`);
  }
}
