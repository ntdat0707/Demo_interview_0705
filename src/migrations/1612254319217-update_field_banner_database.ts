import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldBannerDatabase1612254319217 implements MigrationInterface {
  name = 'updateFieldBannerDatabase1612254319217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "banner" ADD "index" integer DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "banner" DROP COLUMN "index"`);
  }
}
