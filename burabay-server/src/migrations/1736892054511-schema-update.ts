import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1736892054511 implements MigrationInterface {
    name = 'SchemaUpdate1736892054511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "useless"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "useless" character varying`);
    }

}
