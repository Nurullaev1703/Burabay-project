import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBookingTable1626435160562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "time" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "time" SET NOT NULL`);
  }
}
