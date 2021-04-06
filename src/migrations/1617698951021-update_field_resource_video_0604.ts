import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldResourceVideo06041617698951021 implements MigrationInterface {
  name = 'updateFieldResourceVideo06041617698951021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource" ADD "views" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "video" ADD "views" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "views"`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "views"`);
  }
}
