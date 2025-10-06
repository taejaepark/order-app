import app from './app.js';
import dotenv from 'dotenv';
import pool from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 연결 테스트
    await pool.query('SELECT NOW()');
    console.log('✅ 데이터베이스 연결 성공');

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📡 http://localhost:${PORT}`);
      console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

// 종료 시그널 처리
process.on('SIGTERM', async () => {
  console.log('SIGTERM 시그널 수신. 서버를 종료합니다.');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT 시그널 수신. 서버를 종료합니다.');
  await pool.end();
  process.exit(0);
});

startServer();

