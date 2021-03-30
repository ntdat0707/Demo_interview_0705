import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCategory30031617073811198 implements MigrationInterface {
  name = 'updateCategory30031617073811198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "video_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "video_id" uuid NOT NULL, "category_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2a5c61f32e9636ee10821e9a58d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "category" ADD "type" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TABLE "video_category"`);
  }
}
