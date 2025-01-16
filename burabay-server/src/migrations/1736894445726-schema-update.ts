import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1736894445726 implements MigrationInterface {
    name = 'SchemaUpdate1736894445726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "TESTFIELD"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad" ADD "TESTFIELD" character varying`);
    }

}
