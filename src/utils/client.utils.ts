export function detectPlatform(userAgent: string): string {
  let currentOS;

  const web = /mozilla/i.test(userAgent);

  // 웹브라우저에서 요청한 경우
  if (web) {
    currentOS = 'web';
  }
  // 웹브라우저 요청이 아닌경우, android인지 ios인지 확인
  else {
    if (userAgent.search('okhttp') > -1) {
      currentOS = 'android';
    } else if (userAgent.search('alamofire') > -1) {
      currentOS = 'ios';
    } else {
      currentOS = 'else';
    }
  }
  return currentOS;
}
