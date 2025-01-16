import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1736894398736 implements MigrationInterface {
    name = 'SchemaUpdate1736894398736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad" ADD "TESTFIELD" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "TESTFIELD"`);
    }

}
