import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739352623141 implements MigrationInterface {
    name = 'SchemaUpdate1739352623141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "binn"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "date" SET DEFAULT '"2025-02-12T09:30:28.037Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "date" SET DEFAULT '"2025-02-12T09:28:29.385Z"'`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "binn" character varying`);
    }

}
