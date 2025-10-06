# 커피 주문 앱

## 1. 프로젝트 개요

###1.1 프로젝트명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 줌누하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프런트엔드: HTML, CSS, 리액트, 자바스크립트
- 백엔드: Node.js, Express
- 데이터베이스: PostgreSQL

## 3. 기본 사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 화면 설계

### 4.1 주문하기 화면

#### 4.1.1 화면 개요
- 사용자가 커피 메뉴를 선택하고 옵션을 추가하여 장바구니에 담은 후 주문할 수 있는 메인 화면

#### 4.1.2 레이아웃 구성

##### 4.1.2.1 헤더 영역
- **브랜드 로고**: 좌측에 "COZY" 텍스트 표시
- **네비게이션 탭**:
  - "주문하기" 탭 (현재 화면, 활성 상태 표시)
  - "관리자" 탭 (관리자 화면으로 이동)

##### 4.1.2.2 메뉴 카드 영역
메뉴 카드는 그리드 형태로 가로 3개씩 배치되며, 각 카드는 다음 요소를 포함:

**메뉴 카드 구성 요소**:
1. **이미지 영역**: 
   - 메뉴 이미지 표시
   - 이미지가 없을 경우 placeholder 표시
   - 가로세로 비율 유지

2. **메뉴 정보**:
   - 메뉴명: 메뉴 이름 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
   - 가격: 기본 가격 표시 (예: "4,000원")
   - 설명: 간단한 메뉴 설명 (예: "간단한 설명...")

3. **옵션 선택**:
   - 체크박스 형태로 옵션 선택 가능
   - 각 옵션명과 추가 금액 표시
   - 샷 추가: (+500원)
   - 시럽 추가: (+0원)
   - 옵션은 중복 선택 가능

4. **담기 버튼**:
   - 메뉴와 선택된 옵션을 장바구니에 추가하는 버튼
   - 버튼 텍스트: "담기"

##### 4.1.2.3 장바구니 영역
화면 하단에 고정된 영역으로 다음 요소를 포함:

1. **제목**: "장바구니"

2. **주문 항목 리스트**:
   - 각 항목별로 다음 정보 표시
     - 메뉴명 (옵션명) × 수량
     - 가격 (옵션 포함 금액)
   - 예시: "아메리카노(ICE) (샷 추가) × 1    4,500원"
   - 예시: "아메리카노(HOT) × 2    8,000원"

3. **총 금액**:
   - "총 금액" 라벨과 함께 전체 금액 표시
   - 금액은 강조 표시 (예: "12,500원")

4. **주문하기 버튼**:
   - 주문을 확정하는 버튼
   - 버튼 텍스트: "주문하기"

#### 4.1.3 기능 명세

##### 4.1.3.1 메뉴 표시
- 서버에서 메뉴 목록을 조회하여 화면에 표시
- 각 메뉴의 이름, 가격, 이미지, 설명 정보 표시
- 메뉴는 그리드 레이아웃으로 정렬 (반응형: 화면 크기에 따라 개수 조정)

##### 4.1.3.2 옵션 선택
- 각 메뉴마다 독립적으로 옵션 선택 가능
- 체크박스를 통해 샷 추가, 시럽 추가 등의 옵션 선택
- 옵션 선택 시 추가 금액 표시
- 중복 선택 가능 (예: 샷 추가 + 시럽 추가)

##### 4.1.3.3 장바구니에 담기
- "담기" 버튼 클릭 시:
  - 선택된 메뉴와 옵션을 장바구니에 추가
  - 장바구니 영역에 항목 추가 및 총 금액 업데이트
  - 옵션 선택 초기화
- 동일한 메뉴+옵션 조합이 이미 장바구니에 있는 경우:
  - 수량을 1 증가시킴
- 다른 옵션 조합인 경우:
  - 별도의 항목으로 추가

##### 4.1.3.4 장바구니 관리
- 장바구니 항목 표시:
  - 메뉴명, 선택된 옵션, 수량, 가격 표시
  - 항목들을 리스트 형태로 표시
- 총 금액 계산:
  - 모든 항목의 금액을 합산하여 표시
  - 실시간으로 업데이트

##### 4.1.3.5 주문하기
- "주문하기" 버튼 클릭 시:
  - 장바구니가 비어있으면 경고 메시지 표시
  - 장바구니에 항목이 있으면 주문 정보를 서버로 전송
  - 주문 성공 시:
    - 성공 메시지 표시
    - 장바구니 초기화
  - 주문 실패 시:
    - 에러 메시지 표시

#### 4.1.4 데이터 구조

##### 메뉴 아이템
```
{
  id: number,
  name: string,
  price: number,
  image: string,
  description: string,
  available: boolean
}
```

##### 메뉴 옵션
```
{
  id: number,
  name: string,
  price: number
}
```

##### 장바구니 아이템
```
{
  menuId: number,
  menuName: string,
  basePrice: number,
  options: [
    {
      optionId: number,
      optionName: string,
      optionPrice: number
    }
  ],
  quantity: number,
  totalPrice: number
}
```

#### 4.1.5 UI/UX 요구사항

##### 레이아웃
- 반응형 디자인 적용
- 메뉴 카드는 그리드 레이아웃으로 균등하게 배치
- 장바구니 영역은 하단에 고정
- 적절한 여백과 간격 유지

##### 스타일링
- 깔끔하고 현대적인 디자인
- 버튼은 호버 효과 적용
- 활성 탭은 시각적으로 구분
- 가격은 명확하게 표시
- 옵션의 추가 금액은 괄호로 표시

##### 인터랙션
- 담기 버튼 클릭 시 시각적 피드백 제공
- 옵션 선택 시 즉각적인 반응
- 주문하기 버튼 클릭 시 로딩 상태 표시
- 에러 발생 시 사용자 친화적인 메시지 표시

##### 접근성
- 적절한 색상 대비
- 버튼과 인터랙티브 요소는 충분한 크기 확보
- 키보드 네비게이션 지원

#### 4.1.6 에러 처리
- 메뉴 목록 로드 실패 시: "메뉴를 불러올 수 없습니다" 메시지 표시
- 주문 전송 실패 시: "주문에 실패했습니다. 다시 시도해주세요" 메시지 표시
- 빈 장바구니로 주문 시도: "장바구니가 비어있습니다" 메시지 표시
- 네트워크 오류 시: "네트워크 연결을 확인해주세요" 메시지 표시

---

### 4.2 관리자 화면

#### 4.2.1 화면 개요
- 관리자가 메뉴 재고를 관리하고 주문 현황을 확인하며 주문 상태를 변경할 수 있는 관리 화면

#### 4.2.2 레이아웃 구성

##### 4.2.2.1 헤더 영역
- **브랜드 로고**: 좌측에 "COZY" 텍스트 표시
- **네비게이션 탭**:
  - "주문하기" 탭 (주문하기 화면으로 이동)
  - "관리자" 탭 (현재 화면, 활성 상태 표시)

##### 4.2.2.2 관리자 대시보드 영역
주문 상태별 통계를 한눈에 확인할 수 있는 영역:

**표시 항목**:
- 총 주문: 전체 누적 주문 건수
- 주문 접수: 접수된 주문 건수
- 제조 중: 현재 제조 중인 주문 건수
- 제조 완료: 완료된 주문 건수

**표시 형식**: "총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0"

##### 4.2.2.3 재고 현황 섹션
메뉴별 재고를 관리할 수 있는 영역:

**섹션 제목**: "재고 현황"

**재고 카드 구성**:
- 각 메뉴별로 개별 카드로 표시
- 카드 내용:
  - 메뉴명 (예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼")
  - 현재 재고 수량 (예: "10개")
  - 재고 조절 버튼:
    - "+" 버튼: 재고 증가
    - "-" 버튼: 재고 감소
- 카드는 가로로 나란히 배치

##### 4.2.2.4 주문 현황 섹션
현재 주문 목록과 상태를 관리하는 영역:

**섹션 제목**: "주문 현황"

**주문 아이템 구성**:
- 각 주문별로 다음 정보 표시:
  - 주문 시간: 날짜와 시간 (예: "7월 31일 13:00")
  - 주문 내역: 메뉴명과 수량 (예: "아메리카노(ICE) x 1")
  - 주문 금액 (예: "4,000원")
  - 주문 상태 변경 버튼 (예: "주문 접수")
- 주문들은 리스트 형태로 표시
- 최신 주문이 상단에 표시

#### 4.2.3 기능 명세

##### 4.2.3.1 대시보드 통계 표시
- 서버에서 주문 통계 데이터 조회
- 실시간으로 주문 상태별 건수 표시:
  - 총 주문: 모든 주문의 누적 건수
  - 주문 접수: 상태가 "접수"인 주문 건수
  - 제조 중: 상태가 "제조 중"인 주문 건수
  - 제조 완료: 상태가 "완료"인 주문 건수
- 주문 상태 변경 시 실시간으로 통계 업데이트

##### 4.2.3.2 재고 관리
- **재고 조회**:
  - 서버에서 메뉴별 재고 정보 조회
  - 각 메뉴의 현재 재고 수량 표시
  
- **재고 증가** (+ 버튼):
  - 클릭 시 해당 메뉴의 재고를 1 증가
  - 서버에 재고 업데이트 요청
  - 성공 시 화면의 재고 수량 즉시 업데이트
  
- **재고 감소** (- 버튼):
  - 클릭 시 해당 메뉴의 재고를 1 감소
  - 재고가 0인 경우 감소 불가 (버튼 비활성화 또는 경고 메시지)
  - 서버에 재고 업데이트 요청
  - 성공 시 화면의 재고 수량 즉시 업데이트

- **재고 표시**:
  - 재고가 부족한 경우 (예: 5개 이하) 시각적으로 강조 표시

##### 4.2.3.3 주문 현황 조회
- 서버에서 주문 목록 조회
- 주문 정보 표시:
  - 주문 시간 (최신 순으로 정렬)
  - 주문 항목 (메뉴명, 옵션, 수량)
  - 주문 금액
  - 현재 주문 상태
- 주문 목록은 자동으로 갱신 (폴링 또는 실시간 업데이트)

##### 4.2.3.4 주문 상태 관리
- **상태 변경 버튼**:
  - 현재 주문 상태에 따라 다음 상태로 변경하는 버튼 표시
  - 주문 접수 → "주문 접수" 버튼 (클릭 시 "제조 중"으로 변경)
  - 제조 중 → "제조 시작" 버튼 (클릭 시 "제조 완료"로 변경)
  - 제조 완료 → "완료" 버튼 표시 (추가 액션 없음 또는 주문 삭제)

- **상태 변경 프로세스**:
  - 버튼 클릭 시 서버에 상태 변경 요청
  - 성공 시:
    - 주문 항목의 상태 및 버튼 업데이트
    - 대시보드 통계 업데이트
    - 필요 시 성공 메시지 표시
  - 실패 시:
    - 에러 메시지 표시

##### 4.2.3.5 실시간 데이터 갱신
- 주문 목록 자동 갱신 (예: 5초마다 폴링)
- 새로운 주문 발생 시 자동으로 주문 현황에 추가
- 대시보드 통계 자동 업데이트

#### 4.2.4 데이터 구조

##### 대시보드 통계
```
{
  totalOrders: number,
  pendingOrders: number,
  inProgressOrders: number,
  completedOrders: number
}
```

##### 재고 정보
```
{
  menuId: number,
  menuName: string,
  stock: number
}
```

##### 주문 정보
```
{
  orderId: number,
  orderTime: string (ISO 8601),
  items: [
    {
      menuName: string,
      options: string[],
      quantity: number
    }
  ],
  totalPrice: number,
  status: string ("pending" | "in_progress" | "completed")
}
```

##### 주문 상태
- `pending`: 주문 접수 대기
- `in_progress`: 제조 중
- `completed`: 제조 완료

#### 4.2.5 UI/UX 요구사항

##### 레이아웃
- 섹션별로 명확히 구분된 영역
- 재고 카드는 가로로 정렬
- 주문 목록은 세로 스크롤 가능
- 반응형 디자인 적용

##### 스타일링
- 대시보드 통계는 한눈에 파악하기 쉽게 표시
- 재고 카드는 일관된 스타일로 배치
- 주문 상태별로 다른 색상 또는 스타일 적용
- 버튼은 현재 상태를 명확히 나타내는 레이블 사용

##### 인터랙션
- 재고 조절 버튼 클릭 시 즉각적인 피드백
- 상태 변경 버튼 클릭 시 로딩 상태 표시
- 재고가 0일 때 - 버튼 비활성화
- 버튼에 호버 효과 적용

##### 정보 표시
- 주문 시간은 가독성 좋은 형식으로 표시 (예: "7월 31일 13:00")
- 금액은 천 단위 구분 기호 사용
- 주문 상태는 명확한 한글로 표시

##### 실시간성
- 새로운 주문이 들어오면 시각적으로 강조
- 데이터 갱신 시 부드러운 전환 효과

#### 4.2.6 에러 처리
- 재고 조회 실패 시: "재고 정보를 불러올 수 없습니다" 메시지 표시
- 재고 업데이트 실패 시: "재고 업데이트에 실패했습니다" 메시지 표시
- 재고 감소 불가 시 (재고 0): "재고가 부족합니다" 메시지 표시
- 주문 목록 조회 실패 시: "주문 정보를 불러올 수 없습니다" 메시지 표시
- 주문 상태 변경 실패 시: "상태 변경에 실패했습니다. 다시 시도해주세요" 메시지 표시
- 네트워크 오류 시: "네트워크 연결을 확인해주세요" 메시지 표시

#### 4.2.7 추가 고려사항
- 관리자 화면 접근 권한 관리 (향후 확장 가능)
- 주문 취소 기능 (향후 확장 가능)
- 주문 내역 필터링 및 검색 기능 (향후 확장 가능)
- 통계 기간 설정 기능 (향후 확장 가능)

---

## 5. 백엔드 설계

### 5.1 데이터 모델

#### 5.1.1 Menus (메뉴 테이블)
커피 메뉴의 기본 정보를 저장하는 테이블

**필드:**
- `id` (Primary Key): 메뉴 고유 식별자
- `name` (String, Required): 커피 이름 (예: "아메리카노(ICE)")
- `description` (Text): 메뉴 설명
- `price` (Integer, Required): 가격 (원 단위)
- `image` (String): 이미지 URL
- `stock` (Integer, Default: 0): 재고 수량
- `available` (Boolean, Default: true): 판매 가능 여부
- `created_at` (Timestamp): 생성 일시
- `updated_at` (Timestamp): 수정 일시

**비즈니스 로직:**
- 재고가 0이면 자동으로 `available = false`
- 재고가 5개 미만이면 관리자 화면에서 "주의" 표시
- 재고가 0개면 "품절" 표시

#### 5.1.2 Options (옵션 테이블)
메뉴에 추가할 수 있는 옵션 정보를 저장하는 테이블

**필드:**
- `id` (Primary Key): 옵션 고유 식별자
- `name` (String, Required): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (Integer, Required): 추가 가격 (원 단위, 0 가능)
- `menu_id` (Foreign Key): 연결된 메뉴 ID (NULL 가능 - 전체 메뉴 공통 옵션)
- `available` (Boolean, Default: true): 사용 가능 여부
- `created_at` (Timestamp): 생성 일시
- `updated_at` (Timestamp): 수정 일시

**비즈니스 로직:**
- `menu_id`가 NULL이면 모든 메뉴에 적용 가능한 공통 옵션
- `menu_id`가 지정되면 특정 메뉴에만 적용

#### 5.1.3 Orders (주문 테이블)
고객의 주문 정보를 저장하는 테이블

**필드:**
- `id` (Primary Key): 주문 고유 식별자
- `order_number` (String, Unique): 주문 번호 (예: "ORD-20251006-001")
- `order_time` (Timestamp, Required): 주문 일시
- `total_price` (Integer, Required): 총 주문 금액
- `status` (Enum, Required): 주문 상태
  - `pending`: 주문 접수
  - `in_progress`: 제조 중
  - `completed`: 제조 완료
- `items` (JSON): 주문 내용 (메뉴, 수량, 옵션, 금액)
- `created_at` (Timestamp): 생성 일시
- `updated_at` (Timestamp): 수정 일시

**items JSON 구조:**
```json
[
  {
    "menuId": 1,
    "menuName": "아메리카노(ICE)",
    "basePrice": 4000,
    "quantity": 2,
    "options": [
      {
        "optionId": 1,
        "optionName": "샷 추가",
        "optionPrice": 500
      }
    ],
    "itemTotal": 9000
  }
]
```

**비즈니스 로직:**
- 주문 생성 시 자동으로 `order_number` 생성
- 주문 생성 시 기본 상태는 `pending`
- 상태 변경 흐름: pending → in_progress → completed
- 주문 취소 시 이전 상태로 되돌리기 가능 (completed → in_progress 또는 in_progress → pending)

### 5.2 데이터베이스 스키마

#### 5.2.1 ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│     Menus       │
├─────────────────┤
│ PK  id          │
│     name        │
│     description │
│     price       │
│     image       │
│     stock       │
│     available   │
│     created_at  │
│     updated_at  │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│    Options      │
├─────────────────┤
│ PK  id          │
│     name        │
│     price       │
│ FK  menu_id     │
│     available   │
│     created_at  │
│     updated_at  │
└─────────────────┘

┌─────────────────┐
│     Orders      │
├─────────────────┤
│ PK  id          │
│     order_number│
│     order_time  │
│     total_price │
│     status      │
│     items (JSON)│
│     created_at  │
│     updated_at  │
└─────────────────┘
```

### 5.3 사용자 흐름 및 데이터 처리

#### 5.3.1 메뉴 조회 흐름

1. 사용자가 "주문하기" 화면에 진입
2. 프론트엔드에서 `GET /api/menus` 요청
3. 백엔드에서 Menus 테이블 조회
4. 각 메뉴와 연결된 Options 조회 (JOIN 또는 별도 쿼리)
5. 메뉴 목록을 브라우저 화면에 표시
6. 재고 수량은 관리자 화면에만 표시 (일반 사용자 화면에는 숨김)

#### 5.3.2 주문 생성 흐름

1. 사용자가 메뉴와 옵션을 선택하여 장바구니에 추가
2. 장바구니 정보는 프론트엔드 상태로 관리
3. 사용자가 "주문하기" 버튼 클릭
4. 프론트엔드에서 `POST /api/orders` 요청 (장바구니 데이터 전송)
5. 백엔드에서 주문 정보를 Orders 테이블에 저장
   - `order_number` 자동 생성
   - `order_time` 현재 시각
   - `status` = 'pending'
   - `items` JSON 저장
6. 주문된 메뉴의 재고 차감
   - 각 메뉴의 `stock` 필드 업데이트
   - 재고가 0이 되면 `available = false`
7. 주문 완료 응답 반환
8. 프론트엔드에서 성공 메시지 표시 및 장바구니 초기화

#### 5.3.3 주문 현황 조회 흐름

1. 관리자가 "관리자" 화면에 진입
2. 프론트엔드에서 `GET /api/orders` 요청
3. 백엔드에서 Orders 테이블 조회 (최신순 정렬)
4. 주문 목록을 관리자 화면의 "주문 현황"에 표시
5. 각 주문의 상태 표시:
   - pending: "주문 접수" (노란색)
   - in_progress: "제조 중" (붉은색)
   - completed: "제조 완료" (초록색)

#### 5.3.4 주문 상태 변경 흐름

1. 관리자가 주문 카드의 상태 변경 버튼 클릭
   - "제조 시작" 버튼: pending → in_progress
   - "제조 완료" 버튼: in_progress → completed
2. 프론트엔드에서 `PUT /api/orders/:id/status` 요청
3. 백엔드에서 해당 주문의 status 업데이트
4. 업데이트된 주문 정보 반환
5. 프론트엔드에서 UI 업데이트 및 통계 갱신

#### 5.3.5 주문 취소 (상태 되돌리기) 흐름

1. 관리자가 "취소" 버튼 클릭
   - in_progress → pending
   - completed → in_progress
2. 프론트엔드에서 `PUT /api/orders/:id/cancel` 요청
3. 백엔드에서 해당 주문의 status를 이전 상태로 변경
4. 업데이트된 주문 정보 반환
5. 프론트엔드에서 UI 업데이트 및 통계 갱신

#### 5.3.6 재고 관리 흐름

1. 관리자가 재고 조절 버튼 클릭 (+/-)
2. 프론트엔드에서 `PUT /api/stocks/:menuId` 요청
3. 백엔드에서 Menus 테이블의 stock 필드 업데이트
4. 재고 변경 후 상태 확인:
   - stock == 0: available = false, 상태 "품절"
   - stock < 5: 상태 "주의"
   - stock >= 5: 상태 "정상"
5. 업데이트된 재고 정보 반환
6. 프론트엔드에서 UI 업데이트

### 5.4 API 설계

#### 5.4.1 메뉴 관리 API

##### GET /api/menus
메뉴 목록 조회

**Request:**
```
GET /api/menus
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "깔끔한 설명...",
      "price": 4000,
      "image": "https://example.com/image.jpg",
      "stock": 10,
      "available": true
    }
  ]
}
```

##### GET /api/menus/:id
특정 메뉴 상세 조회

**Request:**
```
GET /api/menus/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "아메리카노(ICE)",
    "description": "깔끔한 설명...",
    "price": 4000,
    "image": "https://example.com/image.jpg",
    "stock": 10,
    "available": true,
    "options": [
      {
        "id": 1,
        "name": "샷 추가",
        "price": 500
      }
    ]
  }
}
```

#### 5.4.2 옵션 관리 API

##### GET /api/options
옵션 목록 조회

**Request:**
```
GET /api/options?menuId=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "샷 추가",
      "price": 500,
      "menuId": null
    },
    {
      "id": 2,
      "name": "시럽 추가",
      "price": 0,
      "menuId": null
    }
  ]
}
```

#### 5.4.3 주문 관리 API

##### POST /api/orders
주문 생성

**Request:**
```json
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "menuId": 1,
      "menuName": "아메리카노(ICE)",
      "basePrice": 4000,
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
  "totalPrice": 9000
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-20251006-001",
    "orderTime": "2025-10-06T13:00:00.000Z",
    "totalPrice": 9000,
    "status": "pending",
    "items": [...]
  },
  "message": "주문이 완료되었습니다."
}
```

**비즈니스 로직:**
1. 주문 정보를 Orders 테이블에 저장
2. 주문된 메뉴의 재고를 차감 (stock -= quantity)
3. 재고가 0이 되면 해당 메뉴의 available을 false로 변경
4. 트랜잭션으로 처리하여 데이터 무결성 보장

##### GET /api/orders
주문 목록 조회

**Request:**
```
GET /api/orders?status=pending&limit=10&offset=0
```

**Query Parameters:**
- `status` (Optional): 주문 상태 필터 (pending, in_progress, completed)
- `limit` (Optional): 조회 개수 (기본값: 20)
- `offset` (Optional): 시작 위치 (기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-20251006-001",
      "orderTime": "2025-10-06T13:00:00.000Z",
      "totalPrice": 9000,
      "status": "pending",
      "items": [
        {
          "menuId": 1,
          "menuName": "아메리카노(ICE)",
          "basePrice": 4000,
          "quantity": 2,
          "options": [
            {
              "optionId": 1,
              "optionName": "샷 추가",
              "optionPrice": 500
            }
          ],
          "itemTotal": 9000
        }
      ]
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

##### GET /api/orders/:id
특정 주문 상세 조회

**Request:**
```
GET /api/orders/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-20251006-001",
    "orderTime": "2025-10-06T13:00:00.000Z",
    "totalPrice": 9000,
    "status": "pending",
    "items": [...]
  }
}
```

##### PUT /api/orders/:id/status
주문 상태 변경

**Request:**
```json
PUT /api/orders/1/status
Content-Type: application/json

{
  "status": "in_progress"
}
```

**Validation:**
- pending → in_progress: 허용
- in_progress → completed: 허용
- 그 외 상태 변경: 400 Bad Request

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "in_progress",
    "updatedAt": "2025-10-06T13:05:00.000Z"
  },
  "message": "주문 상태가 변경되었습니다."
}
```

##### PUT /api/orders/:id/cancel
주문 상태 취소 (이전 단계로 되돌리기)

**Request:**
```json
PUT /api/orders/1/cancel
```

**비즈니스 로직:**
- in_progress → pending
- completed → in_progress
- pending 상태는 취소 불가

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending",
    "updatedAt": "2025-10-06T13:06:00.000Z"
  },
  "message": "주문 상태가 취소되었습니다."
}
```

##### GET /api/orders/stats
주문 통계 조회

**Request:**
```
GET /api/orders/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 10,
    "pendingOrders": 3,
    "inProgressOrders": 2,
    "completedOrders": 5
  }
}
```

#### 5.4.4 재고 관리 API

##### GET /api/stocks
재고 목록 조회

**Request:**
```
GET /api/stocks
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "menuId": 1,
      "menuName": "아메리카노 (ICE)",
      "stock": 10,
      "status": "정상"
    },
    {
      "menuId": 2,
      "menuName": "아메리카노 (HOT)",
      "stock": 3,
      "status": "주의"
    },
    {
      "menuId": 3,
      "menuName": "카페라떼",
      "stock": 0,
      "status": "품절"
    }
  ]
}
```

**상태 판정 로직:**
- stock == 0: "품절"
- stock < 5: "주의"
- stock >= 5: "정상"

##### PUT /api/stocks/:menuId
재고 변경

**Request:**
```json
PUT /api/stocks/1
Content-Type: application/json

{
  "action": "increase"  // or "decrease"
}
```

**비즈니스 로직:**
- action = "increase": stock += 1
- action = "decrease": stock -= 1 (단, stock > 0일 때만)
- stock이 0이 되면 available = false
- stock이 0에서 증가하면 available = true

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "menuId": 1,
    "menuName": "아메리카노 (ICE)",
    "stock": 11,
    "available": true,
    "status": "정상"
  },
  "message": "재고가 업데이트되었습니다."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "재고가 부족합니다.",
  "data": {
    "menuId": 1,
    "currentStock": 0
  }
}
```

### 5.5 에러 처리

#### 5.5.1 HTTP 상태 코드

| 코드 | 의미 | 사용 예시 |
|------|------|----------|
| 200 | OK | 조회, 수정 성공 |
| 201 | Created | 주문 생성 성공 |
| 400 | Bad Request | 잘못된 요청 데이터 |
| 404 | Not Found | 존재하지 않는 메뉴/주문 |
| 409 | Conflict | 재고 부족으로 주문 불가 |
| 500 | Internal Server Error | 서버 오류 |

#### 5.5.2 에러 응답 형식

```json
{
  "success": false,
  "error": "에러 메시지",
  "code": "ERROR_CODE",
  "details": {
    // 추가 상세 정보
  }
}
```

#### 5.5.3 주요 에러 케이스

1. **재고 부족 에러**
```json
{
  "success": false,
  "error": "재고가 부족하여 주문할 수 없습니다.",
  "code": "INSUFFICIENT_STOCK",
  "details": {
    "menuId": 1,
    "menuName": "아메리카노(ICE)",
    "requestedQuantity": 5,
    "availableStock": 3
  }
}
```

2. **잘못된 상태 변경 에러**
```json
{
  "success": false,
  "error": "잘못된 상태 변경입니다.",
  "code": "INVALID_STATUS_TRANSITION",
  "details": {
    "currentStatus": "completed",
    "requestedStatus": "pending"
  }
}
```

### 5.6 데이터베이스 인덱스

성능 최적화를 위한 인덱스 설계:

```sql
-- Menus 테이블
CREATE INDEX idx_menus_available ON Menus(available);
CREATE INDEX idx_menus_stock ON Menus(stock);

-- Options 테이블
CREATE INDEX idx_options_menu_id ON Options(menu_id);

-- Orders 테이블
CREATE INDEX idx_orders_status ON Orders(status);
CREATE INDEX idx_orders_order_time ON Orders(order_time DESC);
CREATE INDEX idx_orders_order_number ON Orders(order_number);
```

### 5.7 보안 고려사항

1. **입력 데이터 검증**
   - 주문 금액 검증: 클라이언트가 보낸 금액과 서버에서 계산한 금액 비교
   - 수량 제한: 한 번에 주문 가능한 최대 수량 제한
   - SQL Injection 방지: Prepared Statement 사용

2. **데이터 무결성**
   - 트랜잭션 사용: 주문 생성과 재고 차감을 하나의 트랜잭션으로 처리
   - 동시성 제어: 재고 업데이트 시 LOCK 사용

3. **향후 확장**
   - 관리자 인증/인가 (JWT 토큰)
   - Rate Limiting (과도한 주문 요청 방지)
   - CORS 설정