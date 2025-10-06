# API 테스트 가이드

## 서버 실행

```bash
# 백엔드 서버 실행
cd server
npm run dev

# 프론트엔드 서버 실행 (새 터미널)
cd ui
npm run dev
```

## API 엔드포인트 테스트

### 1. 메뉴 관리 API

#### 메뉴 목록 조회
```bash
curl http://localhost:5000/api/menus
```

#### 특정 메뉴 조회 (옵션 포함)
```bash
curl http://localhost:5000/api/menus/1
```

### 2. 옵션 관리 API

#### 전체 옵션 조회
```bash
curl http://localhost:5000/api/options
```

#### 특정 메뉴의 옵션 조회
```bash
curl "http://localhost:5000/api/options?menuId=1"
```

### 3. 주문 관리 API

#### 주문 생성
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노",
        "basePrice": 4500,
        "quantity": 2,
        "options": [
          {
            "optionId": 1,
            "optionName": "샷 추가",
            "optionPrice": 500
          }
        ]
      }
    ],
    "totalPrice": 10000
  }'
```

#### 주문 목록 조회
```bash
# 전체 주문
curl http://localhost:5000/api/orders

# 상태별 필터링
curl "http://localhost:5000/api/orders?status=pending"

# 페이지네이션
curl "http://localhost:5000/api/orders?limit=10&offset=0"
```

#### 특정 주문 조회
```bash
curl http://localhost:5000/api/orders/1
```

#### 주문 상태 변경
```bash
# pending -> in_progress
curl -X PUT http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# in_progress -> completed
curl -X PUT http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

#### 주문 취소 (이전 단계로)
```bash
curl -X PUT http://localhost:5000/api/orders/1/cancel
```

#### 주문 통계 조회
```bash
curl http://localhost:5000/api/orders/stats
```

### 4. 재고 관리 API

#### 재고 목록 조회
```bash
curl http://localhost:5000/api/stocks
```

#### 재고 증가
```bash
curl -X PUT http://localhost:5000/api/stocks/1 \
  -H "Content-Type: application/json" \
  -d '{"action": "increase"}'
```

#### 재고 감소
```bash
curl -X PUT http://localhost:5000/api/stocks/1 \
  -H "Content-Type: application/json" \
  -d '{"action": "decrease"}'
```

## PowerShell 테스트 명령어

### 메뉴 조회
```powershell
(Invoke-RestMethod -Uri "http://localhost:5000/api/menus").data | Format-Table
```

### 주문 통계 조회
```powershell
(Invoke-RestMethod -Uri "http://localhost:5000/api/orders/stats").data
```

### 재고 조회
```powershell
(Invoke-RestMethod -Uri "http://localhost:5000/api/stocks").data | Format-Table
```

### 주문 생성
```powershell
$body = @{
  items = @(
    @{
      menuId = 1
      menuName = "아메리카노"
      basePrice = 4500
      quantity = 1
      options = @()
    }
  )
  totalPrice = 4500
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:5000/api/orders" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

## 프론트엔드 테스트 시나리오

### 주문하기 페이지
1. http://localhost:3000 접속
2. '주문하기' 탭 선택
3. 메뉴가 데이터베이스에서 로드되는지 확인
4. 메뉴 선택 및 옵션 추가
5. 장바구니에 추가
6. '주문하기' 버튼 클릭
7. 주문 완료 메시지 및 주문번호 확인

### 관리자 페이지
1. '관리자' 탭 선택
2. 대시보드에 주문 통계가 표시되는지 확인
3. 재고 현황에서 +/- 버튼으로 재고 조정
4. 주문 현황에서 주문 상태 변경 (주문 접수 -> 제조 중 -> 완료)
5. 취소 버튼으로 이전 단계로 되돌리기

## 데이터베이스 확인

```bash
# PostgreSQL 접속
psql -U postgres -d order_app_db

# 테이블 확인
\dt

# 메뉴 조회
SELECT * FROM menus;

# 주문 조회
SELECT order_id, order_number, status, total_amount, created_at FROM orders;

# 재고 조회
SELECT menu_id, name, stock_quantity, is_available FROM menus;
```

## 에러 테스트

### 재고 부족 시 주문
```bash
# 재고를 0으로 만들기
curl -X PUT http://localhost:5000/api/stocks/1 \
  -H "Content-Type: application/json" \
  -d '{"action": "decrease"}'

# 해당 메뉴 주문 시도 (409 Conflict 예상)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items": [{"menuId": 1, "quantity": 1}], "totalPrice": 4500}'
```

### 잘못된 상태 변경
```bash
# completed -> pending (400 Bad Request 예상)
curl -X PUT http://localhost:5000/api/orders/3/status \
  -H "Content-Type: application/json" \
  -d '{"status": "pending"}'
```

### 존재하지 않는 리소스
```bash
# 404 Not Found 예상
curl http://localhost:5000/api/menus/999
curl http://localhost:5000/api/orders/999
```

