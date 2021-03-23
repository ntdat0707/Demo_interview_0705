import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldLanguage23031616497219872 implements MigrationInterface {
  name = 'updateFieldLanguage23031616497219872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "language" ADD "image" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "image"`);
  }
}
