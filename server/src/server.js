import app from './app.js';
import dotenv from 'dotenv';
import pool from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// 서버 시작
const startServer = async () => {
  try {
    console.log('🔌 데이터베이스 연결 테스트 중...');
    console.log(`📡 연결 대상: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    
    // 데이터베이스 연결 테스트 (재시도 로직 포함)
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        await pool.query('SELECT NOW()');
        console.log('✅ 데이터베이스 연결 성공');
        break;
      } catch (dbError) {
        retryCount++;
        console.error(`❌ 데이터베이스 연결 실패 (시도 ${retryCount}/${maxRetries}):`, dbError.message);
        
        if (retryCount >= maxRetries) {
          throw dbError;
        }
        
        console.log(`⏳ ${2000 * retryCount}ms 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
      }
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📡 http://localhost:${PORT}`);
      console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Render: ${process.env.RENDER === 'true' ? '예' : '아니오'}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    console.error('💡 문제 해결 방법:');
    console.error('   1. Render PostgreSQL 서비스가 활성화되어 있는지 확인');
    console.error('   2. 환경 변수 (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD) 확인');
    console.error('   3. Render 대시보드에서 PostgreSQL 연결 정보 재확인');
    console.error('   4. 네트워크 연결 상태 확인');
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

