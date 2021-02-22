import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldAgnetDatabase1612758118043 implements MigrationInterface {
  name = 'updateFieldAgnetDatabase1612758118043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agent" RENAME COLUMN "emailCompany" TO "company_email"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "agent" RENAME COLUMN "company_email" TO "emailCompany"`);
  }
}
