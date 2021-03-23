import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateVideo1616467931562 implements MigrationInterface {
  name = 'updateVideo1616467931562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video" ADD "language_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "video" ADD "code" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "language_id"`);
  }
}
