#! /bin/bash

# --repo 옵션 처리 및 FULL_TAG 변수 설정
REPO=""
# --version(-v) 옵션 처리 및 MDT_VERSION 변수 설정
MDT_VERSION=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --repo)
            REPO="$2"
            shift 2
            ;;
        --version|-v)
            MDT_VERSION="$2"
            shift 2
            ;;
        *)
            break
            ;;
    esac
done

# MDT_VERSION이 지정되지 않았으면 기본값 사용
if [ -z "$MDT_VERSION" ]; then
    MDT_VERSION="$MDT_BUILD_VERSION"
fi

if [ -z "$REPO" ]; then
    echo "오류: --repo 옵션을 반드시 지정해야 합니다." >&2
    exit 1
fi

FULL_TAG="$REPO/mdt-gui:$MDT_VERSION"

# 사용법 출력 (--help 옵션)
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "사용법: $0 --repo <REPO> [--version <VERSION>]"
    echo ""
    echo "옵션:"
    echo "  --repo <REPO>           (필수) 푸시할 도커 레포지토리 경로 (예: myrepo)"
    echo "  --version, -v <VERSION> 버전 지정 (예: 1.3.0). 기본값은 \$MDT_BUILD_VERSION"
    echo "  --help, -h              도움말 출력"
    echo ""
    echo "예제:"
    echo "  $0 --repo myrepo                          # 기본 버전으로 푸시"
    echo "  $0 --repo myrepo --version 1.3.0         # 1.3.0 버전으로 푸시"
    exit 0
fi

echo "==> Docker 이미지 PUSH 시작: $FULL_TAG"

# 이미지 태그 변경
docker tag mdt-gui:$MDT_VERSION $FULL_TAG

# Docker 이미지 Docker Hub에 푸시
docker push $FULL_TAG

# 성공 메시지
if [ $? -eq 0 ]; then
    echo "==> DockerHub에 이미지 푸시 완료: $FULL_TAG"
else
    echo "==> DockerHub에 이미지 푸시 실패!"
    exit 1
fi