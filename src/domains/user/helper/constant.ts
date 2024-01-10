// 유저 권한
export enum EmailVerifyType {
  NEWUSER = 'NEWUSER',
  OLDUSER = 'OLDUSER',
}
// 게시판 관련
export enum BoardVerifyType {
  AUCTION = 'auction',
  AUCTIONSELLING = 'auctionSelling',
  AUCTIONTEMP = 'auctionTemp',
  AUCTIONEND = 'auctionEnd',
  ADOPTION = 'adoption',
  FREE = 'free',
  MARKET = 'market',
  REPLY = 'reply',
  COMMENT = 'comment',
  SELLING = 'selling',
  END = 'end',
}

// 게시판 정렬 기준
export enum BoardOrderCriteria {
  CREATED = 'created',
  PRICE = 'price',
  VIEW = 'view',
  MARKET = 'market',
  REPLY = 'reply',
  COMMENT = 'comment',
  SELLING = 'selling',
  END = 'end',
}
