import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceLanguage1615966184131 implements MigrationInterface {
  name = 'updateResourceLanguage1615966184131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "code" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "language_id"`);
  }
}
