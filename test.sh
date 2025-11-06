#!/bin/bash

# 기존 컨테이너가 있으면 중지하고 제거
if [ "$(docker ps -aq -f name=mdt-gui-backend)" ]; then
    echo "기존 mdt-gui-backend 컨테이너를 제거합니다..."
    docker stop mdt-gui-backend 2>/dev/null
    docker rm mdt-gui-backend 2>/dev/null
fi

docker run  \
  --name mdt-gui-backend \
  -p 10100:10100 \
  -v mdt-gui-data:/mdt/mdt-gui-backend/data \
  --add-host mdt-manager:host-gateway \
  --add-host mdt-operation-http:host-gateway \
  mdt-gui-backend:${MDT_BUILD_VERSION}


docker run  \
  --name mdt-gui-frontend \
  -p 3000:3000 \
  --add-host mdt-gui-backend:host-gateway \
  --add-host mdt-manager:host-gateway \
  --add-host mdt-workflow-argo:host-gateway \
  mdt-gui-frontend:${MDT_BUILD_VERSION}