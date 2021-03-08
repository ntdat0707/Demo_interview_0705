import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateData1615190536014 implements MigrationInterface {
  name = 'updateData1615190536014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "solution_image" DROP COLUMN "is_avatar"`);
    await queryRunner.query(`ALTER TABLE "banner" ADD "index" integer DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "branch" ALTER COLUMN "description" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "branch" ALTER COLUMN "description" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN "index"`);
    await queryRunner.query(`ALTER TABLE "solution_image" ADD "is_avatar" boolean NOT NULL DEFAULT false`);
  }
}
