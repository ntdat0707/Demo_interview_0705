import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLanguage1616556986588 implements MigrationInterface {
  name = 'updateLanguage1616556986588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agent" DROP COLUMN "created_on"`);
    await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "language" ADD "image" text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "image"`);
    await queryRunner.query(`ALTER TABLE "video" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "video" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "agent" ADD "created_on" character varying NOT NULL`);
  }
}
