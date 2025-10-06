import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Render PostgreSQL 연결 정보 (환경 변수에서 가져오기)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'order_app_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const { Pool } = pg;

const deployToRender = async () => {
  console.log('=================================');
  console.log('🚀 Render PostgreSQL에 스키마 배포 시작');
  console.log('=================================');
  console.log(`📡 연결 정보: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  console.log(`👤 사용자: ${dbConfig.user}`);
  console.log(`🔒 SSL: ${dbConfig.ssl ? '활성화' : '비활성화'}`);

  const pool = new Pool(dbConfig);
  let client;

  try {
    // 데이터베이스 연결
    console.log('\n🔌 Render PostgreSQL에 연결 중...');
    client = await pool.connect();
    console.log('✅ Render PostgreSQL 연결 성공!');

    // SQL 파일 읽기
    const sqlFilePath = path.join(__dirname, 'database/init.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('\n📝 테이블 및 데이터 생성 중...');

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
        await client.query(statement);
        console.log(`✅ ${i + 1}/${statements.length} 쿼리 실행 완료`);
      } catch (error) {
        console.error(`❌ 쿼리 ${i + 1} 실행 실패:`, error.message);
        console.error('실패한 쿼리:', statement.substring(0, 100) + '...');
        
        // 일부 오류는 무시 (테이블이 이미 존재하는 경우 등)
        if (error.message.includes('already exists') || 
            error.message.includes('relation') && error.message.includes('already exists')) {
          console.log('⚠️  테이블이 이미 존재합니다. 건너뜁니다.');
          continue;
        }
        throw error;
      }
    }

    console.log('\n✅ Render PostgreSQL 스키마 배포 완료!\n');

    // 결과 확인
    const menusResult = await client.query('SELECT COUNT(*) FROM menus');
    const optionsResult = await client.query('SELECT COUNT(*) FROM options');
    const ordersResult = await client.query('SELECT COUNT(*) FROM orders');

    console.log('📊 생성된 데이터:');
    console.log(`   - Menus: ${menusResult.rows[0].count}개`);
    console.log(`   - Options: ${optionsResult.rows[0].count}개`);
    console.log(`   - Orders: ${ordersResult.rows[0].count}개`);

    console.log('\n🎉 Render PostgreSQL 배포가 완료되었습니다!');
    console.log('📱 이제 프론트엔드를 Render에 배포할 수 있습니다.');

  } catch (err) {
    console.error('❌ Render PostgreSQL 배포 실패:', err.message);
    console.error('💡 해결 방법:');
    console('   1. .env 파일의 DB 정보가 올바른지 확인하세요');
    console('   2. Render PostgreSQL 서비스가 활성화되어 있는지 확인하세요');
    console('   3. 네트워크 연결을 확인하세요');
    console.error('\n🔧 환경 변수 설정 예시:');
    console.error('DB_HOST=dpg-xxxxxxxxx-a.oregon-postgres.render.com');
    console.error('DB_PORT=5432');
    console.error('DB_NAME=order_app_db_xxxx');
    console.error('DB_USER=order_app_db_user');
    console.error('DB_PASSWORD=your_password_here');
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
};

// 환경 변수 확인
if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.error('💡 .env 파일에 다음 정보를 설정하세요:');
  console.error('DB_HOST=your-render-db-host');
  console.error('DB_PORT=5432');
  console.error('DB_NAME=your-render-db-name');
  console.error('DB_USER=your-render-db-user');
  console.error('DB_PASSWORD=your-render-db-password');
  process.exit(1);
}

deployToRender();
