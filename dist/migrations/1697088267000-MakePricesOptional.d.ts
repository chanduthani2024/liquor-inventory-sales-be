import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class MakePricesOptional1697088267000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
