import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1739386159277 implements MigrationInterface {
    name = 'SchemaUpdate1739386159277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "bin" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "reg_coupon_path" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "iban_doc_path" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "org_rule_path" character varying`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "date" SET DEFAULT '"2025-02-12T18:49:21.860Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "date" SET DEFAULT '"2025-02-10T12:59:40.969Z"'`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "org_rule_path"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "iban_doc_path"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "reg_coupon_path"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "bin"`);
    }

}
