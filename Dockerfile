# 베이스 이미지로 node.js 16.19.0 버전 사용
# 로컬 PC에 설치된 버전과 일치시켰음
FROM node:16.19.0

# 명령어를 실행할 워크 디렉토리 생성
RUN mkdir -p /app
WORKDIR /app

# 프로젝트 전체를 워크 디렉토리에 추가
ADD . /app/

# 의존성 설치
RUN npm install

# nest.js 빌드
RUN npm run build

# 포트 개방
EXPOSE 3000

# 서버 실행
ENTRYPOINT npm run start:prod