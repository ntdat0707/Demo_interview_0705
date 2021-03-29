import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCategory29031616984433365 implements MigrationInterface {
  name = 'updateCategory29031616984433365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" ADD "status" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "status"`);
  }
}
