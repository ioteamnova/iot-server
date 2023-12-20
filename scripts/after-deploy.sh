# nvm 설정을 로드합니다.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# nvm을 설치한 이후부터는 위와 같이 nvm을 실행해야만 node관련 도구들(ex: npm이나 pm2)이 동작한다.(그래서 그런지 nvm을 설치하면 ~/.bashrc에 위의 명령어가 자동으로 추가된다.)
/home/ubuntu/.nvm/versions/node/v19.8.1/bin/pm2 restart main