import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCareerV11616148151098 implements MigrationInterface {
  name = 'updateCareerV11616148151098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "career" ADD "code" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "career" DROP COLUMN "code"`);
  }
}
