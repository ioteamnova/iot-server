import { ApiProperty } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';
import { IotBoardPersonal } from '../entities/iot-board-personal.entity';

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
    description: '현재 uvb 램프 현황',
    default: 'true',
  })
  currentUvbLight: number;

  @ApiProperty({
    description: '현재 heating 램프 현황',
    default: 'true',
  })
  currentHeatingLight: number;

  @ApiProperty({
    description: '조명 자동화 체크',
    default: 'true',
  })
  autoChkLight: number;

  @ApiProperty({
    description: '온도 자동화 체크',
    default: 'true',
  })
  autoChkTemp: number;

  @ApiProperty({
    description: '습도 자동화 체크',
    default: 'true',
  })
  autoChkHumid: number;

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
    description: '자동 조광기 켜지는 시간',
    default: '00:00',
  })
  autoLightUtctimeOn: string;

  @ApiProperty({
    description: '자동 조광기 꺼지는 시간',
    default: '00:00',
  })
  autoLightUtctimeOff: string;

  @ApiProperty({
    description: 'boardTempName',
    default: 'KR_B1',
  })
  boardTempName: string;

  @ApiProperty({
    description: '생성일',
    default: DateUtils.momentNow(),
  })
  createdAt: Date;

  constructor(iotBoardPersonal: IotBoardPersonal) {
    this.idx = iotBoardPersonal.idx;
    this.cageName = iotBoardPersonal.cageName;
    this.currentUvbLight = iotBoardPersonal.currentUvbLight;
    this.currentHeatingLight = iotBoardPersonal.currentHeatingLight;
    this.autoChkLight = iotBoardPersonal.autoChkLight;
    this.autoChkTemp = iotBoardPersonal.autoChkTemp;
    this.autoChkHumid = iotBoardPersonal.autoChkHumid;
    this.currentTemp = iotBoardPersonal.currentTemp;
    this.currentTemp2 = iotBoardPersonal.currentTemp2;
    this.maxTemp = iotBoardPersonal.maxTemp;
    this.minTemp = iotBoardPersonal.minTemp;
    this.currentHumid = iotBoardPersonal.currentHumid;
    this.currentHumid2 = iotBoardPersonal.currentHumid2;
    this.maxHumid = iotBoardPersonal.maxHumid;
    this.minHumid = iotBoardPersonal.minHumid;
    this.usage = iotBoardPersonal.usage;
    this.autoLightUtctimeOn = iotBoardPersonal.autoLightUtctimeOn;
    this.autoLightUtctimeOff = iotBoardPersonal.autoLightUtctimeOff;
    this.boardTempName = iotBoardPersonal.iotAuthInfo.boardTempName;
  }
}
