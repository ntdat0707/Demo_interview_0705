import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableVideos1612407975767 implements MigrationInterface {
  name = 'createTableVideos1612407975767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "video" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "flag" character varying NOT NULL, "description" character varying, "video" text, "link_video" text, "status" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "video"`);
  }
}
