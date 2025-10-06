# T,J 커피 주문 앱 - 백엔드 서버

Express.js와 PostgreSQL을 사용한 RESTful API 서버

## 기술 스택

- **Node.js** - JavaScript 런타임
- **Express.js 4.18** - 웹 프레임워크
- **PostgreSQL** - 관계형 데이터베이스
- **pg** - PostgreSQL 클라이언트
- **dotenv** - 환경 변수 관리
- **cors** - CORS 처리
- **nodemon** - 개발 서버 자동 재시작

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 값을 설정하세요:

```bash
cp .env.example .env
```

`.env` 파일 예시:
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_app_db
DB_USER=postgres
DB_PASSWORD=your_password

CLIENT_URL=http://localhost:3000
```

### 3. 데이터베이스 초기화

데이터베이스와 테이블을 자동으로 생성하는 스크립트를 실행하세요:

```bash
npm run db:init
```

이 명령은 다음 작업을 수행합니다:
- `order_app_db` 데이터베이스 생성
- 테이블 생성 (menus, options, orders)
- 인덱스 생성
- 샘플 데이터 삽입 (메뉴 6개, 옵션 12개, 테스트 주문 3개)

> **주의**: 기존 데이터베이스가 있으면 삭제하고 재생성합니다.

### 4. 서버 실행

#### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

#### 프로덕션 모드
```bash
npm start
```

## 프로젝트 구조

```
server/
├── database/           # 데이터베이스 관련 파일
│   └── init.sql       # DB 초기화 SQL 스크립트
├── scripts/           # 유틸리티 스크립트
│   └── initDatabase.js # DB 자동 초기화 스크립트
├── src/
│   ├── config/        # 설정 파일
│   │   └── database.js # 데이터베이스 연결 설정
│   ├── routes/        # API 라우트
│   ├── controllers/   # 비즈니스 로직
│   ├── models/        # 데이터 모델
│   ├── middlewares/   # 커스텀 미들웨어
│   ├── app.js        # Express 앱 설정
│   └── server.js     # 서버 진입점
├── .env              # 환경 변수 (gitignore)
├── .gitignore        # Git 무시 파일 목록
├── package.json      # 프로젝트 설정 및 의존성
└── README.md         # 프로젝트 문서
```

## API 엔드포인트

### 기본 엔드포인트

- `GET /` - API 정보
- `GET /health` - 헬스 체크

### 메뉴 관리 (예정)

- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 메뉴 상세 조회

### 주문 관리 (예정)

- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 주문 상세 조회
- `GET /api/orders/stats` - 주문 통계 조회
- `PUT /api/orders/:id/status` - 주문 상태 변경
- `PUT /api/orders/:id/cancel` - 주문 취소

### 재고 관리 (예정)

- `GET /api/stocks` - 재고 목록 조회
- `PUT /api/stocks/:menuId` - 재고 변경

## 개발 정보

- 포트: 5000 (기본값)
- 데이터베이스: PostgreSQL
- CORS: 프론트엔드(localhost:3000) 허용

## 사용 가능한 npm 스크립트

```bash
npm start        # 프로덕션 서버 실행
npm run dev      # 개발 서버 실행 (nodemon, 자동 재시작)
npm run db:init  # 데이터베이스 초기화 (재생성)
```

## 데이터베이스 스키마

### menus 테이블
커피 메뉴 정보를 저장합니다.
- `menu_id` (Primary Key)
- `name` - 메뉴 이름
- `description` - 메뉴 설명
- `price` - 가격
- `image_url` - 이미지 URL
- `stock_quantity` - 재고 수량
- `is_available` - 판매 가능 여부
- `created_at`, `updated_at` - 타임스탬프

### options 테이블
메뉴별 옵션 정보를 저장합니다.
- `option_id` (Primary Key)
- `menu_id` (Foreign Key → menus)
- `name` - 옵션 이름 (예: 샷 추가)
- `price` - 추가 가격
- `created_at` - 타임스탬프

### orders 테이블
주문 정보를 저장합니다.
- `order_id` (Primary Key)
- `order_number` - 주문 번호 (고유)
- `items` - 주문 항목들 (JSON)
- `total_amount` - 총 금액
- `status` - 주문 상태 (pending, in_progress, completed, cancelled)
- `created_at`, `updated_at` - 타임스탬프

## 개발 진행 상황

- [x] 서버 환경 구성
- [x] 데이터베이스 스키마 생성
- [x] 샘플 데이터 삽입
- [ ] API 라우트 구현
- [ ] 컨트롤러 로직 작성
- [ ] 프론트엔드 연동

## 문제 해결

### 포트가 이미 사용 중인 경우
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### 데이터베이스 연결 오류
- PostgreSQL이 실행 중인지 확인
- `.env` 파일의 데이터베이스 설정 확인
- 데이터베이스 사용자 권한 확인

