# nvm 설정을 로드합니다.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Node.js 버전을 사용합니다.
nvm use 19.8.1

/home/ubuntu/.nvm/versions/node/v19.8.1/bin/pm2 restart main