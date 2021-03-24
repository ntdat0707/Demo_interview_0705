import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteImageResourceV21616581990946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "focused_market_image"`);
    await queryRunner.query(`DROP TABLE "solution_image"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "focused_market_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" text, "alt" character varying, "focused_id" uuid NOT NULL, "is_avatar" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ea95c85034ef615560394e2c31c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "solution_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" text, "alt" character varying, "solution_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d13e46bce3b4f840e1bda29ce30" PRIMARY KEY ("id")`,
    );
  }
}
