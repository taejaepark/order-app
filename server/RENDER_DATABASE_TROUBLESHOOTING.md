# Render PostgreSQL 연결 문제 해결 가이드

## 🚨 해결된 문제

### **오류: getaddrinfo ENOTFOUND dpg-d3hka8j3fgac739sdjr0-a.oregon-postgres.render.com**

이 오류는 DNS 해결 실패로, 주로 다음과 같은 원인으로 발생합니다:
1. **SSL 설정 누락**
2. **연결 타임아웃 설정 부족**
3. **Render 환경 변수 미설정**
4. **PostgreSQL 서비스 비활성화**

## ✅ 적용된 해결책

### 1. **SSL 설정 강화**
```javascript
ssl: isProduction || isRender ? {
  rejectUnauthorized: false,
  require: true
} : false
```

### 2. **연결 타임아웃 증가**
```javascript
connectionTimeoutMillis: 10000, // 2초 → 10초
```

### 3. **Render 전용 연결 옵션**
```javascript
...(isRender && {
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  statement_timeout: 30000,
  query_timeout: 30000
})
```

### 4. **재시도 로직 추가**
- 최대 3회 재시도
- 지수 백오프 (2초, 4초, 6초)

### 5. **상세한 로깅**
- 연결 정보 출력
- SSL 상태 표시
- Render 환경 감지

## 🔧 연결 테스트

### **로컬에서 테스트**
```bash
cd server
npm run test:db
```

### **예상 출력 (성공)**
```
=================================
🔍 Render PostgreSQL 연결 테스트
=================================
🌍 환경: production
🔗 Render: 예
📡 호스트: dpg-d3hka8j3fgac739sdjr0-a.oregon-postgres.render.com
🔌 포트: 5432
🗄️ 데이터베이스: order_app_db_xxxx
👤 사용자: order_app_db_user
🔑 비밀번호: 설정됨

🔌 데이터베이스 연결 시도 중...
✅ 데이터베이스 연결 성공!
⏰ 현재 시간: 2025-01-06 12:00:00.000+00
🐘 PostgreSQL 버전: PostgreSQL 15.x on x86_64-pc-linux-gnu

🎉 연결 테스트 완료!
```

## 🎯 Render 환경 변수 설정

### **필수 환경 변수**
```
NODE_ENV=production
RENDER=true
DB_HOST=dpg-d3hka8j3fgac739sdjr0-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=order_app_db_xxxx
DB_USER=order_app_db_user
DB_PASSWORD=your_generated_password
```

### **Render 대시보드에서 설정**
1. **웹 서비스** → **Environment** 탭
2. 다음 환경 변수 추가:
   ```
   NODE_ENV = production
   RENDER = true
   ```
3. **PostgreSQL 서비스** → **Info** 탭에서 연결 정보 복사

## 🚀 배포 후 확인

### **1. 서버 로그 확인**
Render 대시보드에서 다음 로그를 확인:
```
🔌 데이터베이스 연결 테스트 중...
📡 연결 대상: dpg-xxxxx-a.oregon-postgres.render.com:5432/order_app_db_xxxx
✅ 데이터베이스 연결 성공
✅ PostgreSQL 데이터베이스에 연결되었습니다.
📡 연결 정보: dpg-xxxxx-a.oregon-postgres.render.com:5432/order_app_db_xxxx
👤 사용자: order_app_db_user
🔒 SSL: 활성화
=================================
🚀 서버가 포트 10000에서 실행 중입니다.
🔗 Render: 예
=================================
```

### **2. API 테스트**
```bash
curl https://your-app-url.onrender.com/health
curl https://your-app-url.onrender.com/api/menus
```

### **3. 데이터베이스 스키마 배포**
```bash
npm run deploy:render
```

## 🔍 문제 해결

### **ENOTFOUND 오류**
- **원인**: DNS 해결 실패
- **해결**: 
  - DB_HOST가 올바른지 확인
  - Render PostgreSQL 서비스가 활성화되어 있는지 확인
  - SSL 설정 확인

### **ECONNREFUSED 오류**
- **원인**: 연결 거부
- **해결**:
  - DB_PORT 확인 (기본값: 5432)
  - 방화벽 설정 확인

### **인증 오류**
- **원인**: 잘못된 사용자명/비밀번호
- **해결**:
  - DB_USER와 DB_PASSWORD 재확인
  - Render에서 제공한 정확한 인증 정보 사용

### **SSL 오류**
- **원인**: SSL 설정 문제
- **해결**:
  - `rejectUnauthorized: false` 설정 확인
  - `require: true` 설정 확인

## 📊 성능 최적화

### **연결 풀 설정**
```javascript
max: 20, // 최대 연결 수
idleTimeoutMillis: 30000, // 유휴 타임아웃
connectionTimeoutMillis: 10000, // 연결 타임아웃
```

### **Keep-Alive 설정**
```javascript
keepAlive: true,
keepAliveInitialDelayMillis: 10000,
```

## 🎉 완료 확인

배포 성공 시 다음이 모두 정상 작동해야 합니다:
- ✅ 서버 시작
- ✅ 데이터베이스 연결
- ✅ API 엔드포인트 응답
- ✅ 헬스 체크 통과

---

🎯 **이제 Render PostgreSQL 연결이 안정적으로 작동할 것입니다!**
