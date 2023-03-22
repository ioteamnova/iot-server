import {
  BaseEntity as BaseTypeormEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default abstract class BaseEntity extends BaseTypeormEntity {
  @PrimaryGeneratedColumn({
    comment: '인덱스',
    unsigned: true,
    type: 'integer',
  })
  readonly idx: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date | null;

  // /**
  //  * 내부 변수를 업데이트 한다.
  //  *
  //  * @param properties 프로퍼티 목록
  //  * @param func 추가 비지니스 로직을 실행하는 함수
  //  * */
  // setProperties<U extends this>(properties: Partial<U>, func?: (instance: BaseEntity, properties: Partial<U>) => void): this {
  // 	const propertyNames = Object.keys(properties);

  // 	for (let i = 0; i < propertyNames.length; i++) {
  // 		if (propertyNames[i] === 'idx') continue;
  // 		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // 		// @ts-ignore
  // 		this[propertyNames[i]] = properties[propertyNames[i]];
  // 	}

  // 	func && func(this, properties);

  // 	return this;
  // }

  // get createdAtToString(): string {
  // 	return DateUtils.convertDateToString(this.createdAt);
  // }

  // get updatedAtToString(): string {
  // 	return DateUtils.convertDateToString(this.updatedAt);
  // }

  // get deletedAtToString(): string {
  // 	return DateUtils.convertDateToString(this.deletedAt);
  // }
}
