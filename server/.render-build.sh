#!/usr/bin/env bash
# Render 빌드 스크립트

echo "🚀 Render 빌드 시작..."

# Node.js 버전 확인
echo "📦 Node.js 버전: $(node --version)"
echo "📦 npm 버전: $(npm --version)"

# 의존성 설치
echo "📦 의존성 설치 중..."
npm ci --only=production

# 빌드 완료
echo "✅ 빌드 완료!"

# 시작 명령어 실행
echo "🚀 서버 시작..."
npm start
