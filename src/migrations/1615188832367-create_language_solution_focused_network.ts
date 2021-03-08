import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLanguageSolutionFocusedNetwork1615188832367 implements MigrationInterface {
  name = 'createLanguageSolutionFocusedNetwork1615188832367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "branch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country_id" uuid NOT NULL, "province" character varying NOT NULL, "address" character varying NOT NULL, "contact" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2e39f426e2faefdaa93c5961976" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "image" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "focused_market" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language_id" uuid NOT NULL, "title" character varying NOT NULL, "feature_image" text, "status" character varying NOT NULL DEFAULT 'unpublish', "is_publish" boolean NOT NULL DEFAULT false, "publish_date" TIMESTAMP WITH TIME ZONE, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_97adf469bf1f41b4b006c1754e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "focused_market_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" text, "alt" character varying, "focused_id" uuid NOT NULL, "is_avatar" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ea95c85034ef615560394e2c31c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "language" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "solution" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language_id" uuid NOT NULL, "title" character varying NOT NULL, "banner_image" text, "status" character varying NOT NULL DEFAULT 'unpublish', "is_publish" boolean NOT NULL DEFAULT false, "publish_date" TIMESTAMP WITH TIME ZONE, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_73fc40b114205776818a2f2f248" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "solution_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" text, "alt" character varying, "solution_id" uuid NOT NULL, "is_avatar" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d13e46bce3b4f840e1bda29ce30" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "solution_image"`);
    await queryRunner.query(`DROP TABLE "solution"`);
    await queryRunner.query(`DROP TABLE "language"`);
    await queryRunner.query(`DROP TABLE "focused_market_image"`);
    await queryRunner.query(`DROP TABLE "focused_market"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "branch"`);
  }
}
