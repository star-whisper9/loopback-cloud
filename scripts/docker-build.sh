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
echo "=== 提取静态资源到 $PROJECT_DIR/build/ ==="
rm -rf "$PROJECT_DIR/build"
mkdir -p "$PROJECT_DIR/build"

CONTAINER_ID=$(docker create "${IMAGE_NAME}:${IMAGE_TAG}")
docker cp "$CONTAINER_ID:/app/build/." "$PROJECT_DIR/build"
docker rm "$CONTAINER_ID" > /dev/null

echo ""
echo "=== 完成 ==="
echo "镜像已构建: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "静态资源已提取到: $PROJECT_DIR/build/"
echo ""
echo "启动服务:  docker compose up -d"
echo "查看日志:  docker compose logs -f"
