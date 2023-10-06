import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { RefToken } from '../entities/ref-token.entity';

@CustomRepository(RefToken)
export class RefTokenRepository extends Repository<RefToken> {

    // 리프레시 토큰행 생성 또는 불러오기
  async createOrUpdateRefToken(userIdx:number, platform:string, refToken:string){
    // 리프레시 토큰행이 존재하는지 확인
    let entity = await this.findOne({
      where: {
        userIdx,
        platform
      },
    });

    if (entity) {
      // 있으면 기존의 토큰행 업데이트
      entity.refToken = refToken;
    } else {
      // 없으면 토큰행 생성
      entity = this.create({
        userIdx,
        platform,
        refToken,
      });
    }
    // todo: 암호화해서 리프레시 토큰 저장
    this.save(entity);
  }
}
