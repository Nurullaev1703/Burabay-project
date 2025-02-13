import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739352504278 implements MigrationInterface {
    name = 'SchemaUpdate1739352504278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "binn" character varying`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "date" SET DEFAULT '"2025-02-12T09:28:29.385Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "date" SET DEFAULT '"2025-02-12T09:21:32.829Z"'`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "binn"`);
    }

}
