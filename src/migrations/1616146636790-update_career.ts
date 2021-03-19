import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCareer1616146636790 implements MigrationInterface {
  name = 'updateCareer1616146636790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "vancancies"`);
    await queryRunner.query(`ALTER TABLE "career" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "career" ADD "vacancies" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`COMMENT ON COLUMN "agent"."created_at" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "vacancies"`);
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "career" ADD "vancancies" numeric NOT NULL DEFAULT '0'`);
  }
}
