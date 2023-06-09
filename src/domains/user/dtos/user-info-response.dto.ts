import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';

export class UserInfoResponseDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty({
    description: '유저 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '생성일',
    default: DateUtils.momentNow(),
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    default: DateUtils.momentNow(),
  })
  updatedAt: Date;
}
