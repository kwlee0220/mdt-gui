#!/bin/bash

# MDT GUI Backend Server 서비스 설치 스크립트
# Ubuntu 22.04 systemd 서비스 생성

set -e
WORK_DIR=$MDT_HOME/mdt-gui/dtbackend-main
BIN_HOME=$MDT_HOME/mdt-gui/sbin/dtbackend

echo "MDT GUI Backend Server 서비스를 설치합니다..."
SERVICE=mdt-gui-backend

$BIN_HOME/env_substitute.sh $BIN_HOME/env.development.template -o $WORK_DIR/.env.development -v

# 서비스 파일을 systemd 디렉토리로 복사
$BIN_HOME/env_substitute.sh $BIN_HOME/$SERVICE.template -o $BIN_HOME/$SERVICE.service -v
sudo cp $BIN_HOME/$SERVICE.service /etc/systemd/system/

# systemd 데몬 리로드
sudo systemctl daemon-reload

# 서비스 활성화
sudo systemctl enable $SERVICE.service

# 서비스 시작
sudo systemctl start $SERVICE.service

# 서비스 상태 확인
echo "서비스 상태:"
sudo systemctl status $SERVICE.service

echo "MDT Operation Server 서비스가 성공적으로 설치되고 시작되었습니다."
echo "서비스 관리 명령어:"
echo "  시작: sudo systemctl start $SERVICE"
echo "  중지: sudo systemctl stop $SERVICE"
echo "  재시작: sudo systemctl restart $SERVICE"
echo "  상태 확인: sudo systemctl status $SERVICE"
echo "  로그 확인: sudo journalctl -u $SERVICE -f"
