import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableSolution1615199329812 implements MigrationInterface {
  name = 'updateTableSolution1615199329812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution_image" RENAME COLUMN "alt" TO "is_banner"`);
    await queryRunner.query(`ALTER TABLE "solution_image" DROP COLUMN "is_banner"`);
    await queryRunner.query(`ALTER TABLE "solution_image" ADD "is_banner" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution_image" DROP COLUMN "is_banner"`);
    await queryRunner.query(`ALTER TABLE "solution_image" ADD "is_banner" character varying`);
    await queryRunner.query(`ALTER TABLE "solution_image" RENAME COLUMN "is_banner" TO "alt"`);
  }
}
