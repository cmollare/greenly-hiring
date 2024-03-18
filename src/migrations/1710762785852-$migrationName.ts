import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1710762785852 implements MigrationInterface {
    name = ' $migrationName1710762785852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_footprint_estimation" ("id" SERIAL NOT NULL, "estimationDate" TIMESTAMP NOT NULL DEFAULT now(), "emissionCO2" double precision NOT NULL, "source" character varying NOT NULL, CONSTRAINT "PK_50e232931466e5c5a8965a4a729" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "carbon_footprint_estimation"`);
    }

}
