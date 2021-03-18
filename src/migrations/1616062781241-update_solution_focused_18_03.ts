import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSolutionFocused18031616062781241 implements MigrationInterface {
  name = 'updateSolutionFocused18031616062781241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution_image" RENAME COLUMN "alt" TO "is_banner"`);
    await queryRunner.query(`ALTER TABLE "focused_market_image" DROP COLUMN "alt"`);
    await queryRunner.query(`ALTER TABLE "focused_market_image" DROP COLUMN "is_avatar"`);
    await queryRunner.query(`ALTER TABLE "focused_market" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "language" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "code" character varying`);
    await queryRunner.query(`ALTER TABLE "solution" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "solution_image" DROP COLUMN "is_banner"`);
    await queryRunner.query(`ALTER TABLE "solution_image" ADD "is_banner" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution_image" DROP COLUMN "is_banner"`);
    await queryRunner.query(`ALTER TABLE "solution_image" ADD "is_banner" character varying`);
    await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "focused_market" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "focused_market_image" ADD "is_avatar" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "focused_market_image" ADD "alt" character varying`);
    await queryRunner.query(`ALTER TABLE "solution_image" RENAME COLUMN "is_banner" TO "alt"`);
  }
}
