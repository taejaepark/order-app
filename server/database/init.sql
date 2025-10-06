-- 데이터베이스 생성 (이미 존재할 수 있으므로 체크)
-- CREATE DATABASE order_app_db;
-- \c order_app_db;

-- 기존 테이블 삭제 (개발 중이므로)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS menus CASCADE;

-- Menus 테이블 생성
CREATE TABLE menus (
  menu_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image_url VARCHAR(500),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블 생성
CREATE TABLE options (
  option_id SERIAL PRIMARY KEY,
  menu_id INTEGER NOT NULL REFERENCES menus(menu_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders 테이블 생성
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_menus_is_available ON menus(is_available);
CREATE INDEX idx_options_menu_id ON options(menu_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- 샘플 데이터 삽입
INSERT INTO menus (name, description, price, image_url, stock_quantity, is_available) VALUES
('아메리카노', '깔끔하고 진한 에스프레소에 물을 더한 커피', 4500, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 50, true),
('카페 라떼', '부드러운 우유와 에스프레소의 조화', 5000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 45, true),
('카푸치노', '풍성한 우유 거품이 매력적인 커피', 5000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d', 40, true),
('바닐라 라떼', '달콤한 바닐라 시럽이 들어간 라떼', 5500, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7', 35, true),
('카페 모카', '초콜릿과 커피의 환상적인 만남', 5500, 'https://images.unsplash.com/photo-1578374173705-0a5dc1e1b089', 30, true),
('카라멜 마키아또', '달콤한 카라멜과 에스프레소의 조화', 6000, 'https://images.unsplash.com/photo-1599639957043-f3aa5c986398', 25, true);

-- 옵션 데이터 삽입 (모든 메뉴에 공통 옵션 추가)
INSERT INTO options (menu_id, name, price) VALUES
-- 아메리카노 옵션
(1, '샷 추가', 500),
(1, '시럽 추가', 500),
-- 카페 라떼 옵션
(2, '샷 추가', 500),
(2, '시럽 추가', 500),
-- 카푸치노 옵션
(3, '샷 추가', 500),
(3, '시럽 추가', 500),
-- 바닐라 라떼 옵션
(4, '샷 추가', 500),
(4, '휘핑크림 추가', 700),
-- 카페 모카 옵션
(5, '샷 추가', 500),
(5, '휘핑크림 추가', 700),
-- 카라멜 마키아또 옵션
(6, '샷 추가', 500),
(6, '휘핑크림 추가', 700);

-- 샘플 주문 데이터 (테스트용)
INSERT INTO orders (order_number, items, total_amount, status) VALUES
('ORD-20251006-001', '[{"menu_id": 1, "menu_name": "아메리카노", "quantity": 2, "price": 4500, "options": [{"name": "샷 추가", "price": 500}], "subtotal": 10000}]', 10000, 'pending'),
('ORD-20251006-002', '[{"menu_id": 2, "menu_name": "카페 라떼", "quantity": 1, "price": 5000, "options": [], "subtotal": 5000}]', 5000, 'in_progress'),
('ORD-20251006-003', '[{"menu_id": 5, "menu_name": "카페 모카", "quantity": 1, "price": 5500, "options": [{"name": "휘핑크림 추가", "price": 700}], "subtotal": 6200}]', 6200, 'completed');


