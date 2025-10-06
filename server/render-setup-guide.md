# Render PostgreSQL 데이터베이스 설정 가이드

이 가이드는 Render PostgreSQL 데이터베이스에 T,J 커피 주문 앱의 스키마를 설정하는 방법을 설명합니다.

## 🚀 1단계: Render PostgreSQL 서비스 생성

### 1.1 Render 웹사이트 접속
- [Render.com](https://render.com)에 로그인
- 대시보드에서 "New +" 버튼 클릭
- "PostgreSQL" 선택

### 1.2 PostgreSQL 설정
```
Name: order-app-db
Database: order_app_db
User: order_app_db_user
Region: Oregon (US West)
PostgreSQL Version: 15
Plan: Free (개발용) 또는 Starter (운영용)
```

### 1.3 연결 정보 확인
PostgreSQL 서비스 생성 후, 연결 정보를 확인하세요:
- **Host**: `dpg-xxxxxxxxx-a.oregon-postgres.render.com`
- **Port**: `5432`
- **Database**: `order_app_db_xxxx`
- **User**: `order_app_db_user`
- **Password**: 자동 생성된 비밀번호

## 🔧 2단계: 환경 변수 설정

### 2.1 .env 파일 생성
`server/.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 서버 설정
PORT=5000
NODE_ENV=production

# Render PostgreSQL 데이터베이스 설정
DB_HOST=dpg-xxxxxxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=order_app_db_xxxx
DB_USER=order_app_db_user
DB_PASSWORD=your_generated_password

# CORS 설정 (프론트엔드 URL)
CLIENT_URL=https://your-frontend-url.onrender.com
```

### 2.2 실제 연결 정보로 교체
위의 예시에서 실제 Render에서 제공하는 연결 정보로 교체하세요.

## 📊 3단계: 데이터베이스 스키마 생성

### 3.1 배포 스크립트 실행
```bash
cd server
node deploy-to-render.js
```

### 3.2 예상 출력
```
=================================
🚀 Render PostgreSQL에 스키마 배포 시작
=================================
📡 연결 정보: dpg-xxxxx-a.oregon-postgres.render.com:5432/order_app_db_xxxx
👤 사용자: order_app_db_user
🔒 SSL: 활성화

🔌 Render PostgreSQL에 연결 중...
✅ Render PostgreSQL 연결 성공!

📝 테이블 및 데이터 생성 중...
✅ 1/25 쿼리 실행 완료
✅ 2/25 쿼리 실행 완료
...
✅ 25/25 쿼리 실행 완료

✅ Render PostgreSQL 스키마 배포 완료!

📊 생성된 데이터:
   - Menus: 6개
   - Options: 12개
   - Orders: 3개

🎉 Render PostgreSQL 배포가 완료되었습니다!
```

## 🔍 4단계: 연결 테스트

### 4.1 연결 확인
```bash
cd server
node -e "
import pool from './src/config/database.js';
try {
  const client = await pool.connect();
  const result = await client.query('SELECT NOW()');
  console.log('✅ Render PostgreSQL 연결 성공:', result.rows[0].now);
  client.release();
  process.exit(0);
} catch (error) {
  console.error('❌ 연결 실패:', error.message);
  process.exit(1);
}
"
```

### 4.2 데이터 확인
```bash
node -e "
import pool from './src/config/database.js';
try {
  const client = await pool.connect();
  const menus = await client.query('SELECT COUNT(*) FROM menus');
  const options = await client.query('SELECT COUNT(*) FROM options');
  const orders = await client.query('SELECT COUNT(*) FROM orders');
  
  console.log('📊 데이터 확인:');
  console.log('Menus:', menus.rows[0].count);
  console.log('Options:', options.rows[0].count);
  console.log('Orders:', orders.rows[0].count);
  
  client.release();
  process.exit(0);
} catch (error) {
  console.error('❌ 데이터 확인 실패:', error.message);
  process.exit(1);
}
"
```

## 🚀 5단계: Render 웹 서비스 배포

### 5.1 웹 서비스 생성
1. Render 대시보드에서 "New +" 클릭
2. "Web Service" 선택
3. GitHub 저장소 연결
4. 설정:
   ```
   Name: order-app-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

### 5.2 환경 변수 설정 (Render 웹 서비스)
Render 웹 서비스 설정에서 다음 환경 변수를 추가:
```
NODE_ENV=production
DB_HOST=dpg-xxxxxxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=order_app_db_xxxx
DB_USER=order_app_db_user
DB_PASSWORD=your_generated_password
CLIENT_URL=https://your-frontend-url.onrender.com
```

## 🎯 6단계: 프론트엔드 배포

### 6.1 환경 변수 설정
프론트엔드 배포 시 다음 환경 변수 추가:
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## 🔧 문제 해결

### 연결 오류
- **SSL 오류**: Render PostgreSQL은 SSL 연결을 요구합니다
- **방화벽**: Render는 외부 접속을 허용합니다
- **비밀번호**: Render에서 생성된 비밀번호를 정확히 입력하세요

### 스키마 생성 오류
- **권한 오류**: 사용자에게 테이블 생성 권한이 있는지 확인
- **테이블 존재**: 이미 테이블이 있는 경우 스크립트가 자동으로 건너뜁니다

### 배포 오류
- **빌드 실패**: package.json의 scripts 확인
- **환경 변수**: 모든 필요한 환경 변수가 설정되었는지 확인

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. Render PostgreSQL 서비스 상태
2. 환경 변수 설정
3. 네트워크 연결
4. 로그 메시지

---

🎉 **완료!** 이제 Render에서 T,J 커피 주문 앱이 실행됩니다!
