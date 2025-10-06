# Render 배포 가이드 - 문제 해결

## 🚨 해결된 문제

### **오류: Cannot find module '/opt/render/project/src/server/index.js'**

이 오류는 Render가 기본적으로 `src/server/index.js` 경로를 찾는데, 실제 파일은 `src/server.js`에 있어서 발생했습니다.

## ✅ 적용된 해결책

### 1. **루트 진입점 파일 생성**
- `server/index.js` 파일 생성
- `src/server.js`를 import하여 실행

### 2. **package.json 수정**
```json
{
  "main": "index.js",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3. **Render 설정 파일 생성**
- `render.yaml`: Render Blueprint 설정
- `.render-build.sh`: 커스텀 빌드 스크립트

### 4. **포트 설정 수정**
- 기본 포트를 10000으로 변경 (Render 권장)

## 🚀 Render 배포 설정

### **방법 1: Blueprint 사용 (추천)**

1. **render.yaml 파일 사용**
   - GitHub 저장소에 `render.yaml` 파일이 있으면 자동으로 감지
   - 데이터베이스와 웹 서비스를 한 번에 생성

2. **배포 단계**
   ```bash
   # 1. GitHub에 코드 푸시
   git add .
   git commit -m "Render 배포 준비"
   git push origin main
   
   # 2. Render에서 Blueprint 배포
   # - Render 대시보드에서 "New +" 클릭
   # - "Blueprint" 선택
   # - GitHub 저장소 연결
   ```

### **방법 2: 수동 설정**

1. **PostgreSQL 데이터베이스 생성**
   ```
   Name: order-app-db
   Database: order_app_db
   User: order_app_db_user
   Plan: Free
   ```

2. **웹 서비스 생성**
   ```
   Name: order-app-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **환경 변수 설정**
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=[Render에서 제공]
   DB_PORT=5432
   DB_NAME=[Render에서 제공]
   DB_USER=[Render에서 제공]
   DB_PASSWORD=[Render에서 제공]
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```

## 🔧 추가 설정

### **헬스 체크**
서버에 `/health` 엔드포인트가 이미 구현되어 있습니다:
```javascript
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString(),
  });
});
```

### **데이터베이스 스키마 배포**
배포 후 다음 명령어로 스키마를 생성하세요:
```bash
npm run deploy:render
```

## 📊 배포 확인

### **1. 서버 상태 확인**
```bash
curl https://your-app-url.onrender.com/health
```

### **2. API 테스트**
```bash
curl https://your-app-url.onrender.com/api/menus
```

### **3. 로그 확인**
Render 대시보드에서 실시간 로그를 확인할 수 있습니다.

## 🎯 예상 결과

배포 성공 시 다음과 같은 로그를 볼 수 있습니다:
```
✅ 데이터베이스 연결 성공
=================================
🚀 서버가 포트 10000에서 실행 중입니다.
📡 https://your-app-url.onrender.com
🌍 환경: production
=================================
```

## 🔍 문제 해결

### **여전히 모듈을 찾을 수 없는 경우**
1. `package.json`의 `main` 필드가 `index.js`인지 확인
2. `index.js` 파일이 루트에 있는지 확인
3. GitHub에 모든 파일이 푸시되었는지 확인

### **데이터베이스 연결 오류**
1. 환경 변수가 올바르게 설정되었는지 확인
2. Render PostgreSQL 서비스가 활성화되어 있는지 확인
3. SSL 연결이 필요한지 확인

### **포트 오류**
- Render는 자동으로 PORT 환경 변수를 설정합니다
- 기본값을 10000으로 설정했지만, Render가 제공하는 PORT를 사용합니다

---

🎉 **이제 Render 배포가 성공적으로 작동할 것입니다!**
