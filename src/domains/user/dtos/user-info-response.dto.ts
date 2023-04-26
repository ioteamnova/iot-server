import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import moment from 'moment';
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
    description: '프로필 이미지 url',
    default: null,
  })
  profilePath: string;

  @ApiProperty({
    description: '소셜 로그인 메서드',
    default: null,
  })
  loginMethod: string;

  @ApiProperty({
    description: '생성일',
    default: DateUtils.momentNow(),
  })
  createdAt: Date;
}
