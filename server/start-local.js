// 로컬 개발용 서버 시작 스크립트
import dotenv from 'dotenv';

// 환경 변수 설정
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'order_app_db';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'friend11!@';
process.env.CLIENT_URL = 'http://localhost:3000';

// 환경 변수 로드
dotenv.config();

console.log('🚀 로컬 개발 서버 시작 중...');
console.log('📡 포트: 5000');
console.log('🗄️ 데이터베이스: localhost:5432/order_app_db');

// 서버 시작
import('./src/server.js');
