import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1738954729708 implements MigrationInterface {
  name = 'SchemaUpdate1738954729708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "date" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "details"`);
    await queryRunner.query(`ALTER TABLE "ad" ADD "details" jsonb NOT NULL DEFAULT '{}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "details"`);
    await queryRunner.query(`ALTER TABLE "ad" ADD "details" json NOT NULL DEFAULT '{}'`);
    await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "date" SET DEFAULT now()`);
  }
}
