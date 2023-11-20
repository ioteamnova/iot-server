import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientRecommend {
  constructor(private readonly redisService: RedisService) {}

  async saveInterest(userIdx, category) {
    const redis = this.redisService.getClient();
    const userCategory = await redis.get(`saveInterest${userIdx}`);
    const userCateInfo = userCategory ? JSON.parse(userCategory) : {};

    // 카테고리가 이미 존재하는지 확인
    if (userCateInfo[category]) {
      // 존재하면 값에 1을 더함
      userCateInfo[category] += 1;
    } else {
      // 존재하지 않으면 카테고리를 추가하고 값은 1로 설정
      userCateInfo[category] = 1;
    }

    // 수정된 정보를 다시 레디스에 저장
    const currentTimestamp = Math.floor(Date.now() / 1000); // 현재 시간의 타임스탬프 (초 단위)
    const endOfDayTimestamp = Math.floor(
      new Date().setHours(23, 59, 59, 999) / 1000,
    ); // 오늘 자정까지의 타임스탬프 (초 단위)
    const ttl = endOfDayTimestamp - currentTimestamp; // 오늘 자정까지 남은 시간 (초 단위)
    await redis.set(`saveInterest${userIdx}`, JSON.stringify(userCateInfo));
    await redis.expire(`saveInterest${userIdx}`, ttl);
  }
  async recommendCategory(userIdx) {
    const result = [];
    const redis = this.redisService.getClient();
    const userCategory = await redis.get(`saveInterest${userIdx}`);
    const userCateInfo = userCategory ? JSON.parse(userCategory) : {};
    console.log('userCateInfo: ', userCateInfo);
    // 모든 카테고리의 값을 더함
    const totalValue = Object.values<number>(userCateInfo).reduce(
      (acc, val) => acc + val,
      0,
    );
    const sortedCategories = Object.keys(userCateInfo).sort(
      (a, b) => userCateInfo[b] - userCateInfo[a],
    );
    // totalValue값이 0 이상일 때만 추천
    const recommendItem = [];
    if (totalValue > 0) {
      console.log('totalValue: ', totalValue);
      // 각 카테고리별로 높은 숫자 순으로 정렬
      console.log('sortedCategories: ', sortedCategories);
      let leftRecommend = 5;

      // 정렬된 카테고리를 순회하면서 높은 값/전체값을 내고, 합이 5가 되면 종료
      for (const category of sortedCategories) {
        const categoryValue = userCateInfo[category];
        const percentage = categoryValue / totalValue;
        const recommendCnt = Math.ceil(5 * percentage);
        recommendItem.push({ category, recommendCnt });
        leftRecommend -= recommendCnt;

        if (leftRecommend === 0) {
          break;
        } else if (leftRecommend < 0) {
          leftRecommend = leftRecommend + recommendCnt;
          break;
        }
      }
    }
    result.push({ recommendItem, sortedCategories });
    console.log('result: ', result);
    await this.findRecommendItem(result);
    return result;
  }
  async findRecommendItem(data: any[]) {
    const recommendItem = data[0].recommendItem;
    for (const item of recommendItem) {
    }
  }
}
