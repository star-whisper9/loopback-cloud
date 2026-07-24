#!/usr/bin/env bash
#
# docker-build.sh
# 构建 loopback-cloud 生产 Docker 镜像

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

IMAGE_NAME="loopback-cloud"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "=== 构建 Docker 镜像: ${IMAGE_NAME}:${IMAGE_TAG} ==="
docker build \
    -t "${IMAGE_NAME}:${IMAGE_TAG}" \
    -f "$PROJECT_DIR/Dockerfile" \
    "$PROJECT_DIR"

echo ""
echo "=== 完成 ==="
echo "镜像已构建: ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "启动服务:  docker compose up -d"
echo "查看日志:  docker compose logs -f"
