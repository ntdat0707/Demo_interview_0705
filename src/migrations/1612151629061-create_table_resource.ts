import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableResource1612151629061 implements MigrationInterface {
  name = 'createTableResource1612151629061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "full_name" character varying NOT NULL, "phone" character varying NOT NULL, "gender" smallint, "avatar" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "label" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5692ac5348861d3776eb5843672" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'unpublish', "is_publish" boolean NOT NULL DEFAULT false, "publish_date" TIMESTAMP WITH TIME ZONE, "description" character varying, "is_edit_seo" boolean NOT NULL DEFAULT false, "title_seo" character varying, "description_seo" character varying, "link" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource_author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource_id" uuid NOT NULL, "author_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f5fec4f1ea73b658dafad7e586c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource_id" uuid NOT NULL, "category_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_477e614ecbd504c16e97402dcd4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "picture" text, "alt" character varying, "resource_id" uuid NOT NULL, "is_avatar" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1a3a0147ada01855fe55e9f659c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource_label" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource_id" uuid NOT NULL, "label_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c0c785d612d109f8557cb4740a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "banner"."created_at" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "banner"."updated_at" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."updatedAt" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission_role"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "permission"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "employee"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."updatedAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "customer"."createdAt" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "banner"."updated_at" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "banner"."created_at" IS NULL`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "resource_label"`);
    await queryRunner.query(`DROP TABLE "resource_image"`);
    await queryRunner.query(`DROP TABLE "resource_category"`);
    await queryRunner.query(`DROP TABLE "resource_author"`);
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(`DROP TABLE "label"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "author"`);
  }
}
