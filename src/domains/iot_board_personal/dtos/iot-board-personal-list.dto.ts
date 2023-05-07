import { ApiProperty } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';
import { Iot_board_personal } from '../entities/iot_board_personal.entity';

export class IotBoardPersonalListDto {
  @ApiProperty({
    description: '개인 보드 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '케이지 이름',
    default: '크레크레',
  })
  cageName: string;

  @ApiProperty({
    description: '현재 조명 현황',
    default: 'true',
  })
  currentLight: boolean;

  @ApiProperty({
    description: '조명 자동화 체크',
    default: 'true',
  })
  autochkLight: boolean;

  @ApiProperty({
    description: '온도 자동화 체크',
    default: 'true',
  })
  autochkTemp: boolean;

  @ApiProperty({
    description: '습도 자동화 체크',
    default: 'true',
  })
  autochkHumid: boolean;

  @ApiProperty({
    description: '현재 온도 1',
    default: '0.0',
  })
  currentTemp: string;

  @ApiProperty({
    description: '현재 온도 2',
    default: '0.0',
  })
  currentTemp2: string;

  @ApiProperty({
    description: '최대 설정 온도',
    default: '0.0',
  })
  maxTemp: string;

  @ApiProperty({
    description: '최소 설정 온도',
    default: '0.0',
  })
  minTemp: string;

  @ApiProperty({
    description: '현재 습도 1',
    default: '0.0',
  })
  currentHumid: string;

  @ApiProperty({
    description: '현재 습도 2',
    default: '0.0',
  })
  currentHumid2: string;

  @ApiProperty({
    description: '최대 설정 습도',
    default: '0.0',
  })
  maxHumid: string;

  @ApiProperty({
    description: '최저 설정 습도',
    default: '0.0',
  })
  minHumid: string;

  @ApiProperty({
    description: '사용 용도',
    default: '0.0',
  })
  usage: string;

  @ApiProperty({
    description: 'utc 시간 설정(피코 용도)',
    default: '0',
  })
  utcTime: string;

  @ApiProperty({
    description: '펫 이름',
    default: '펫 이름',
  })
  name: string;

  @ApiProperty({
    description: '펫 타입',
    default: '펫 타입',
  })
  type: string;

  @ApiProperty({
    description: '펫 성별',
    default: '펫 성별',
  })
  gender: string;

  @ApiProperty({
    description: '생성일',
    default: DateUtils.momentNow(),
  })
  createdAt: Date;

  constructor(iotboardpersonal: Iot_board_personal) {
    this.idx = iotboardpersonal.idx;
    this.cageName = iotboardpersonal.cageName;
    this.currentLight = iotboardpersonal.currentLight;
    this.autochkLight = iotboardpersonal.autochkLight;
    this.autochkTemp = iotboardpersonal.autochkTemp;
    this.autochkHumid = iotboardpersonal.autochkHumid;
    this.currentTemp = iotboardpersonal.currentTemp;
    this.currentTemp2 = iotboardpersonal.currentTemp2;

    this.maxTemp = iotboardpersonal.maxTemp;
    this.minTemp = iotboardpersonal.minTemp;
    this.currentHumid = iotboardpersonal.currentHumid;
    this.currentHumid2 = iotboardpersonal.currentHumid2;
    this.maxHumid = iotboardpersonal.maxHumid;
    this.minHumid = iotboardpersonal.minHumid;
    this.name = iotboardpersonal.pet.name;
    this.type = iotboardpersonal.pet.type;
    this.gender = iotboardpersonal.pet.gender;
  }
}
