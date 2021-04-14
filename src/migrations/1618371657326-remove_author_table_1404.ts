import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAuthorTable14041618371657326 implements MigrationInterface {
  name = 'removeAuthorTable14041618371657326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "author"`);
    await queryRunner.query(`DROP TABLE "resource_author"`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "author" character varying`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "short_description" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "full_name" character varying NOT NULL, "phone" character varying NOT NULL, "gender" smallint, "avatar" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resource_author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "resource_id" uuid NOT NULL, "author_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f5fec4f1ea73b658dafad7e586c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "short_description"`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "author"`);
  }
}
