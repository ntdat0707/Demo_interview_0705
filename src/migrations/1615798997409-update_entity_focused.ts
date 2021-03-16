import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntityFocused1615798997409 implements MigrationInterface {
  name = 'updateEntityFocused1615798997409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution_image" RENAME COLUMN "alt" TO "is_banner"`);
    await queryRunner.query(`ALTER TABLE "focused_market" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "language" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "solution" ADD "code" character varying NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "solution_image" DROP COLUMN "is_banner"`);
    await queryRunner.query(`ALTER TABLE "solution_image" ADD "is_banner" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution_image" DROP COLUMN "is_banner"`);
    await queryRunner.query(`ALTER TABLE "solution_image" ADD "is_banner" character varying`);
    await queryRunner.query(`ALTER TABLE "solution" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "focused_market" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "solution_image" RENAME COLUMN "is_banner" TO "alt"`);
  }
}
