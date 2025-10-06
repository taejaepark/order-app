import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Render PostgreSQL 연결 설정
const isProduction = process.env.NODE_ENV === 'production';
const isRender = process.env.RENDER === 'true' || process.env.DB_HOST?.includes('render.com');

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'order_app_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 연결 타임아웃
  connectionTimeoutMillis: 10000, // 연결 대기 타임아웃 증가
  // Render PostgreSQL SSL 설정
  ssl: isProduction || isRender ? {
    rejectUnauthorized: false,
    require: true
  } : false,
  // 추가 연결 옵션
  ...(isRender && {
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    statement_timeout: 30000,
    query_timeout: 30000
  })
});

// 데이터베이스 연결 테스트
pool.on('connect', (client) => {
  console.log('✅ PostgreSQL 데이터베이스에 연결되었습니다.');
  console.log(`📡 연결 정보: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  console.log(`👤 사용자: ${process.env.DB_USER}`);
  console.log(`🔒 SSL: ${pool.options.ssl ? '활성화' : '비활성화'}`);
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 연결 오류:', err);
  console.error('💡 해결 방법:');
  console.error('   1. 환경 변수 확인: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
  console.error('   2. Render PostgreSQL 서비스 상태 확인');
  console.error('   3. 네트워크 연결 확인');
  if (!isProduction) {
    process.exit(-1);
  }
});

// 쿼리 실행 헬퍼 함수
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('쿼리 실행:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('쿼리 실행 오류:', error);
    throw error;
  }
};

// 트랜잭션 헬퍼 함수
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;

