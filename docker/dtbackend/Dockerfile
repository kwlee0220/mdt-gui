# Node.js 버전 사용
FROM node:22.21-slim

# Yarn 설치 (corepack을 사용하여 최신 stable 버전 활성화)
RUN corepack enable && corepack prepare yarn@stable --activate

# 필요한 시스템 패키지 설치 (better-sqlite3 등 네이티브 모듈 컴파일용)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /mdt/mdt-gui-backend

RUN mkdir -p /mdt/mdt-gui-backend
COPY ./mdt-gui-backend /mdt/mdt-gui-backend

# 의존성 설치
RUN yarn install

# 기본 환경 변수 설정
ENV NODE_ENV=production

# 컨테이너 시작 시 실행할 명령어
CMD ["yarn", "start"]
