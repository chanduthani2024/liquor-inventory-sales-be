import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddNewBottleSizesToBrands1760647616458 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
