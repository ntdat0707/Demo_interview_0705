import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldAvatarCarer13041618284732974 implements MigrationInterface {
  name = 'addFieldAvatarCarer13041618284732974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "career" ADD "avatar" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "avatar"`);
  }
}
