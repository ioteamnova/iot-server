import { BaseEntity as BaseTypeormEntity } from 'typeorm';
export default abstract class BaseEntity extends BaseTypeormEntity {
    readonly idx: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
