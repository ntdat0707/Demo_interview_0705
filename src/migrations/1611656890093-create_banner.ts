import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBanner1611656890093 implements MigrationInterface {
  name = 'createBanner1611656890093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "banner_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "textColor" text, "image" text, "imageAlt" character varying, "link" text, "position" character varying NOT NULL DEFAULT 'homepage', "status" character varying NOT NULL DEFAULT 'active', "validFrom" date, "validTo" date, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_00c4108eb12b2cc78aeda3e432e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "customer"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."updatedAt" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "role"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."createdAt" IS NULL`);
    await queryRunner.query(`DROP TABLE "banner_entity"`);
  }
}
