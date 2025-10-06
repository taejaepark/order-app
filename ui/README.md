# COZY - 커피 주문 앱 (프런트엔드)

React와 Vite를 사용한 커피 주문 앱의 프런트엔드입니다.

## 기술 스택

- **React 18.3.1** - UI 라이브러리
- **Vite 5.4.11** - 빌드 도구 및 개발 서버
- **JavaScript** - 프로그래밍 언어

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 프로덕션 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
ui/
├── public/          # 정적 파일
├── src/
│   ├── App.jsx     # 메인 앱 컴포넌트
│   ├── App.css     # 앱 스타일
│   ├── main.jsx    # 앱 진입점
│   └── index.css   # 글로벌 스타일
├── index.html      # HTML 템플릿
├── vite.config.js  # Vite 설정
└── package.json    # 프로젝트 의존성
```

## 주요 화면

### 1. 주문하기 화면
- 메뉴 카드 목록
- 옵션 선택 (샷 추가, 시럽 추가)
- 장바구니 관리
- 주문하기 기능

### 2. 관리자 화면
- 대시보드 (주문 통계)
- 재고 관리
- 주문 현황 및 상태 관리

## 개발 정보

- 포트: 3000
- 자동 새로고침: 활성화
- Hot Module Replacement (HMR): 활성화
