import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntityFocused16031615887341752 implements MigrationInterface {
  name = 'updateEntityFocused16031615887341752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "focused_market_image" DROP COLUMN "alt"`);
    await queryRunner.query(`ALTER TABLE "focused_market_image" DROP COLUMN "is_avatar"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "focused_market_image" ADD "is_avatar" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "focused_market_image" ADD "alt" character varying`);
  }
}
