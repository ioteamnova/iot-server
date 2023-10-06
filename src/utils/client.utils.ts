

export function detectPlatform(userAgent: string): string{

    let currentOS;
    
    const mobile = /iphone|ipad|ipod|android/i.test(userAgent);

    // 모바일인 경우, android인지 ios인지 확인
    if(mobile){
      if (userAgent.search("android") > -1)
          currentOS = "android";
      else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) currentOS = "ios";
    } 
      
    else{
      // 모바일이 아닌 경우
      currentOS = "web";
    }

    return currentOS
  }