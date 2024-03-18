import { MigrationInterface, QueryRunner } from "typeorm";

export class  $migrationName1710789084996 implements MigrationInterface {
    name = ' $migrationName1710789084996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_footprint_estimation" ALTER COLUMN "emissionCO2" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_footprint_estimation" ALTER COLUMN "emissionCO2" SET NOT NULL`);
    }

}
