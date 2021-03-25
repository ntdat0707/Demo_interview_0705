import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCategory25031616669148536 implements MigrationInterface {
  name = 'updateCategory25031616669148536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "category" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" ADD "title" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" ADD "link" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" ADD "code" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "link"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "category" ADD "name" character varying NOT NULL`);
  }
}
