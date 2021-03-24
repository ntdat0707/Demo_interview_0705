import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResourceImage1616560939412 implements MigrationInterface {
  name = 'updateResourceImage1616560939412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource_image" DROP COLUMN "is_avatar"`);
    await queryRunner.query(`DROP TABLE "resource_image"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "resource_image" ADD "is_avatar" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(
      `CREATE TABLE "resource_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" text, "alt" character varying, "resource_id" uuid NOT NULL, "is_avatar" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1a3a0147ada01855fe55e9f659c" PRIMARY KEY ("id"))`,
    );
  }
}
