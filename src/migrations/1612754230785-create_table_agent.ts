import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAgent1612754230785 implements MigrationInterface {
  name = 'createTableAgent1612754230785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "company_phone" character varying NOT NULL, "company_name" character varying NOT NULL, "website" character varying, "emailCompany" character varying, "country" character varying NOT NULL, "city" character varying NOT NULL, "street" character varying NOT NULL, "contact_name" character varying NOT NULL, "contact_email" character varying NOT NULL, "contact_phone" character varying NOT NULL, "job_title" character varying, "description" character varying, "status" character varying NOT NULL DEFAULT 'active', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1000e989398c5d4ed585cf9a46f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "agent"`);
  }
}
