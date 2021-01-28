import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameBanner1611657208484 implements MigrationInterface {
  name = 'renameBanner1611657208484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "banner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "textColor" text, "image" text, "imageAlt" character varying, "link" text, "position" character varying NOT NULL DEFAULT 'homepage', "status" character varying NOT NULL DEFAULT 'active', "validFrom" date, "validTo" date, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6d9e2570b3d85ba37b681cd4256" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`DROP TABLE "banner_entity"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "banner_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "textColor" text, "image" text, "imageAlt" character varying, "link" text, "position" character varying NOT NULL DEFAULT 'homepage', "status" character varying NOT NULL DEFAULT 'active', "validFrom" date, "validTo" date, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6d9e2570b3d85ba37b681cd4256" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`DROP TABLE "banner"`);
  }
}
