import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTranslateCareerBanner22031616387401940 implements MigrationInterface {
  name = 'addTranslateCareerBanner22031616387401940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "vancancies"`);
    await queryRunner.query(`ALTER TABLE "banner" ADD "language_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "banner" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "career" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "career" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "career" ADD "vacancies" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "closing_date"`);
    await queryRunner.query(`ALTER TABLE "career" ADD "closing_date" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "closing_date"`);
    await queryRunner.query(`ALTER TABLE "career" ADD "closing_date" date`);
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "vacancies"`);
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "career" ADD "vancancies" numeric NOT NULL DEFAULT '0'`);
  }
}
