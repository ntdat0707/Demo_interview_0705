import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSolutionFocused18031616062781241 implements MigrationInterface {
  name = 'updateSolutionFocused18031616062781241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "focused_market" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "language" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "code" character varying`);
    await queryRunner.query(`ALTER TABLE "solution" ADD "code" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "focused_market" DROP COLUMN "code"`);
  }
}
