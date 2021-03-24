import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAgent1616492113218 implements MigrationInterface {
  name = 'updateAgent1616492113218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agent" ADD "created_on" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agent" DROP COLUMN "created_on"`);
  }
}
