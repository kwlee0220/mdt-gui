#! /bin/bash

# 기본 버전 설정
DEFAULT_VERSION=$MDT_BUILD_VERSION

# 첫 번째 인자로 버전을 받거나, 없으면 기본값 사용
MDT_VERSION=${1:-$DEFAULT_VERSION}

# 사용법 출력 (--help 옵션)
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "사용법: $0 [VERSION]"
    echo ""
    echo "예제:"
    echo "  $0           # 기본 버전($DEFAULT_VERSION) 사용"
    echo "  $0 1.3.0     # 버전 1.3.0으로 빌드"
    exit 0
fi

echo "==> Docker 이미지 빌드 시작: mdt-gui:$MDT_VERSION"

# 기존 이미지 삭제
docker image rmi -f mdt-gui:$MDT_VERSION

# 기존 디렉토리 삭제 및 클론
rm -rf mdt-gui
git clone https://github.com/kwlee0220/mdt-gui.git

# Docker 이미지 빌드
docker build -t mdt-gui:$MDT_VERSION .

# 성공 메시지
if [ $? -eq 0 ]; then
    echo "==> 빌드 완료: mdt-gui:$MDT_VERSION"
else
    echo "==> 빌드 실패!"
    exit 1
fi

# docker push kwlee0220/mdt-gui-backend:$MDT_VERSION

# 클론한 디렉토리 정리
rm -rf mdt-gui