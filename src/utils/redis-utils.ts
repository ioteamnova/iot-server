// import { Cache } from 'cache-manager';
// // 맥어드레스로 해당 게시글을 조회 했는지 판단
// export async function redisViewChecker(
//   boardIdx: number,
//   macAddress: string,
//   cacheManager: Cache,
// ): Promise<boolean> {
//   const key = `board:${boardIdx}:view`;
//   const isDuplicate = await cacheManager.get(macAddress);
//   if (isDuplicate) {
//     return false; // 이미 중복 조회된 맥 주소라면 조회수를 증가시키지 않음
//   }
//   await cacheManager.set(macAddress, 'view', 10);
//   // 조회수를 증가시키는 로직을 추가한다면 여기에 작성
//   // 자정에 만료되도록 TTL 설정
//   return true;
// }
