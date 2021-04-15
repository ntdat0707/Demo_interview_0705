import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeDescription15041618456503560 implements MigrationInterface {
  name = 'changeTypeDescription15041618456503560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "focused_market" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "focused_market" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "solution" ADD "description" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "solution" ADD "description" character varying`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "description" character varying`);
    await queryRunner.query(`ALTER TABLE "focused_market" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "focused_market" ADD "description" character varying`);
    await queryRunner.query(`ALTER TABLE "banner" ADD "description" character varying`);
  }
}
