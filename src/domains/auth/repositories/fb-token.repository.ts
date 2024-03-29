import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { FbToken } from '../entities/fb-token.entity';

@CustomRepository(FbToken)
export class FbTokenRepository extends Repository<FbToken> {
  // 파이어베이스 토큰행 생성 또는 불러오기
  async createOrUpdateFbToken(
    userIdx: number,
    platform: string,
    fbToken: string,
  ) {
    // 파이어베이스 토큰행이 존재하는지 확인
    let entity = await this.findOne({
      where: {
        userIdx,
        platform,
      },
    });

    if (entity) {
      // 있으면 기존의 토큰행 업데이트
      entity.fbToken = fbToken;
    } else {
      // 없으면 토큰행 생성
      entity = this.create({
        userIdx,
        platform,
        fbToken,
      });
    }

    // todo: 암호화해서 파이어베이스 토큰 저장
    this.save(entity);
  }

  // 인자에 해당하는 FbToken을 가지고 있는 행이 있다면 삭제한다
  async removeFbTokenIfExists(fbToken: string) {
    // 파이어베이스 토큰행이 존재하는지 확인
    const entity = await this.findOne({
      where: {
        fbToken,
      },
    });

    if (entity) {
      await this.remove(entity);
    }
  }
}
