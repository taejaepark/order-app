import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

// 데이터베이스 초기화 함수
async function initDatabase() {
  // 1단계: postgres 데이터베이스에 연결하여 order_app_db 생성
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // 기본 데이터베이스
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('🔌 PostgreSQL에 연결 중...');
    await adminClient.connect();
    console.log('✅ PostgreSQL 연결 성공');

    // 기존 데이터베이스 확인
    const checkDbResult = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME || 'order_app_db']
    );

    if (checkDbResult.rows.length > 0) {
      console.log(`⚠️  데이터베이스 '${process.env.DB_NAME}' 이미 존재합니다.`);
      console.log('❓ 기존 데이터베이스를 삭제하고 다시 생성하시겠습니까?');
      console.log('   (현재 스크립트는 자동으로 진행합니다)');
      
      // 기존 연결 종료
      await adminClient.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1
        AND pid <> pg_backend_pid()
      `, [process.env.DB_NAME || 'order_app_db']);
      
      // 데이터베이스 삭제
      await adminClient.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME || 'order_app_db'}`);
      console.log(`🗑️  기존 데이터베이스 삭제 완료`);
    }

    // 데이터베이스 생성
    await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME || 'order_app_db'}`);
    console.log(`✅ 데이터베이스 '${process.env.DB_NAME}' 생성 완료`);

    await adminClient.end();

    // 2단계: 생성된 데이터베이스에 연결하여 테이블 생성
    const appClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'order_app_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
    });

    await appClient.connect();
    console.log(`\n🔌 '${process.env.DB_NAME}' 데이터베이스에 연결 중...`);

    // SQL 파일 읽기
    const sqlFilePath = path.join(__dirname, '../database/init.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('📝 테이블 및 데이터 생성 중...\n');

    // 주석과 빈 줄 제거, 세미콜론으로 분리
    const statements = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    // 각 문장을 순차적으로 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await appClient.query(statement);
        console.log(`✅ ${i + 1}/${statements.length} 쿼리 실행 완료`);
      } catch (error) {
        console.error(`❌ 쿼리 ${i + 1} 실행 실패:`, error.message);
        console.error('실패한 쿼리:', statement.substring(0, 100) + '...');
        throw error;
      }
    }

    // 결과 확인
    const menusResult = await appClient.query('SELECT COUNT(*) FROM menus');
    const optionsResult = await appClient.query('SELECT COUNT(*) FROM options');
    const ordersResult = await appClient.query('SELECT COUNT(*) FROM orders');

    console.log('✅ 데이터베이스 초기화 완료!\n');
    console.log('📊 생성된 데이터:');
    console.log(`   - Menus: ${menusResult.rows[0].count}개`);
    console.log(`   - Options: ${optionsResult.rows[0].count}개`);
    console.log(`   - Orders: ${ordersResult.rows[0].count}개`);

    await appClient.end();
    console.log('\n🎉 모든 작업이 완료되었습니다!');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error('\n💡 해결 방법:');
    console.error('   1. PostgreSQL 서비스가 실행 중인지 확인하세요');
    console.error('   2. .env 파일의 DB_PASSWORD가 올바른지 확인하세요');
    console.error('   3. PostgreSQL 사용자 권한을 확인하세요');
    process.exit(1);
  }
}

// 스크립트 실행
console.log('=================================');
console.log('🚀 데이터베이스 초기화 시작');
console.log('=================================\n');

initDatabase();

