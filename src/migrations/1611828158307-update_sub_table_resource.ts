import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSubTableResource1611828158307 implements MigrationInterface {
  name = 'updateSubTableResource1611828158307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "resource_author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resourceId" uuid NOT NULL, "authorId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f5fec4f1ea73b658dafad7e586c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resourceId" uuid NOT NULL, "categoryId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_477e614ecbd504c16e97402dcd4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "picture" text, "alt" character varying, "resourceId" uuid NOT NULL, "isAvatar" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1a3a0147ada01855fe55e9f659c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource_label" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resourceId" uuid NOT NULL, "labelId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c0c785d612d109f8557cb4740a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "banner"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "banner"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."updatedAt" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "role"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "banner"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "banner"."createdAt" IS NULL`);
    await queryRunner.query(`DROP TABLE "resource_label"`);
    await queryRunner.query(`DROP TABLE "resource_image"`);
    await queryRunner.query(`DROP TABLE "resource_category"`);
    await queryRunner.query(`DROP TABLE "resource_author"`);
  }
}
