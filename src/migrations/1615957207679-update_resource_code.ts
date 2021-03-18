import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceCode1615957207679 implements MigrationInterface {
  name = 'updateResourceCode1615957207679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "language" ADD "code" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "code"`);
  }
}
