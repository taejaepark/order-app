import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 라우터 임포트
import menuRoutes from './routes/menuRoutes.js';
import optionRoutes from './routes/optionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stockRoutes from './routes/stockRoutes.js';

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'T,J 커피 주문 앱 API 서버',
    version: '1.0.0',
  });
});

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString(),
  });
});

// API 라우트
app.use('/api/menus', menuRoutes);
app.use('/api/options', optionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stocks', stockRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.',
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('에러 발생:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '서버 내부 오류가 발생했습니다.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;

