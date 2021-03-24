import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceAvarta1616559310217 implements MigrationInterface {
  name = 'updateResourceAvarta1616559310217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource" ADD "avatar" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "avatar"`);
  }
}
