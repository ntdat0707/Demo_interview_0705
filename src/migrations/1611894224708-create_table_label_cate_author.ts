import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableLabelCateAuthor1611894224708 implements MigrationInterface {
  name = 'createTableLabelCateAuthor1611894224708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "fullName" character varying NOT NULL, "phone" character varying NOT NULL, "gender" smallint, "avatar" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "label" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5692ac5348861d3776eb5843672" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(`COMMENT ON COLUMN "resource_author"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_author"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_category"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_category"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_image"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_image"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_label"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_label"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."updatedAt" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "role"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_label"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_label"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_image"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_image"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_category"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_category"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_author"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "resource_author"."createdAt" IS NULL`);
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
    await queryRunner.query(`DROP TABLE "label"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "author"`);
  }
}
