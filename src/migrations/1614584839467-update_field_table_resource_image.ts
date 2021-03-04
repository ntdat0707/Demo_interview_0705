import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldTableResourceImage1614584839467 implements MigrationInterface {
  name = 'updateFieldTableResourceImage1614584839467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource_image" RENAME COLUMN "picture" TO "image"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource_image" RENAME COLUMN "image" TO "picture"`);
  }
}
