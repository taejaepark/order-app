import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Render PostgreSQL 연결 테스트 스크립트
const testConnection = async () => {
  console.log('=================================');
  console.log('🔍 Render PostgreSQL 연결 테스트');
  console.log('=================================');
  
  const isProduction = process.env.NODE_ENV === 'production';
  const isRender = process.env.RENDER === 'true' || process.env.DB_HOST?.includes('render.com');
  
  console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Render: ${isRender ? '예' : '아니오'}`);
  console.log(`📡 호스트: ${process.env.DB_HOST}`);
  console.log(`🔌 포트: ${process.env.DB_PORT}`);
  console.log(`🗄️ 데이터베이스: ${process.env.DB_NAME}`);
  console.log(`👤 사용자: ${process.env.DB_USER}`);
  console.log(`🔑 비밀번호: ${process.env.DB_PASSWORD ? '설정됨' : '설정되지 않음'}`);
  
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: isProduction || isRender ? {
      rejectUnauthorized: false,
      require: true
    } : false,
    connectionTimeoutMillis: 10000,
    ...(isRender && {
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      statement_timeout: 30000,
      query_timeout: 30000
    })
  });

  try {
    console.log('\n🔌 데이터베이스 연결 시도 중...');
    const client = await pool.connect();
    
    console.log('✅ 데이터베이스 연결 성공!');
    
    // 기본 쿼리 테스트
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log(`⏰ 현재 시간: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL 버전: ${result.rows[0].pg_version}`);
    
    // 테이블 존재 확인
    try {
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      if (tables.rows.length > 0) {
        console.log('\n📊 기존 테이블:');
        tables.rows.forEach(row => {
          console.log(`   - ${row.table_name}`);
        });
      } else {
        console.log('\n📊 테이블이 없습니다. 스키마를 생성해야 합니다.');
      }
    } catch (tableError) {
      console.log('\n📊 테이블 확인 중 오류:', tableError.message);
    }
    
    client.release();
    console.log('\n🎉 연결 테스트 완료!');
    
  } catch (error) {
    console.error('\n❌ 연결 실패:', error.message);
    console.error('\n💡 문제 해결 방법:');
    console.error('   1. 환경 변수 확인:');
    console.error(`      DB_HOST=${process.env.DB_HOST}`);
    console.error(`      DB_PORT=${process.env.DB_PORT}`);
    console.error(`      DB_NAME=${process.env.DB_NAME}`);
    console.error(`      DB_USER=${process.env.DB_USER}`);
    console.error(`      DB_PASSWORD=${process.env.DB_PASSWORD ? '***' : 'NOT_SET'}`);
    console.error('   2. Render PostgreSQL 서비스 상태 확인');
    console.error('   3. 네트워크 연결 확인');
    console.error('   4. SSL 설정 확인');
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n🔍 ENOTFOUND 오류 해결:');
      console.error('   - DB_HOST가 올바른지 확인');
      console.error('   - Render PostgreSQL 서비스가 활성화되어 있는지 확인');
      console.error('   - DNS 설정 확인');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔍 ECONNREFUSED 오류 해결:');
      console.error('   - DB_PORT가 올바른지 확인 (기본값: 5432)');
      console.error('   - 방화벽 설정 확인');
    }
    
    if (error.message.includes('password authentication failed')) {
      console.error('\n🔍 인증 오류 해결:');
      console.error('   - DB_USER와 DB_PASSWORD 확인');
      console.error('   - Render에서 제공한 정확한 인증 정보 사용');
    }
  } finally {
    await pool.end();
  }
};

testConnection();
