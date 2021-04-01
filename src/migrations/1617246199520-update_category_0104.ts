import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCategory01041617246199520 implements MigrationInterface {
  name = 'updateCategory01041617246199520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "video_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "video_id" uuid NOT NULL, "category_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2a5c61f32e9636ee10821e9a58d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "category" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" ADD "title" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" ADD "link" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" ADD "code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" ADD "status" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "category" ADD "type" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "link"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "language_id"`);
    await queryRunner.query(`ALTER TABLE "category" ADD "name" character varying NOT NULL`);
    await queryRunner.query(`DROP TABLE "video_category"`);
  }
}
