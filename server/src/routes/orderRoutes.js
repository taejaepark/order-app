import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// GET /api/orders/stats - 주문 통계 조회 (먼저 선언)
router.get('/stats', orderController.getOrderStats);

// POST /api/orders - 주문 생성
router.post('/', orderController.createOrder);

// GET /api/orders - 주문 목록 조회
router.get('/', orderController.getOrders);

// GET /api/orders/:id - 특정 주문 조회
router.get('/:id', orderController.getOrderById);

// PUT /api/orders/:id/status - 주문 상태 변경
router.put('/:id/status', orderController.updateOrderStatus);

// PUT /api/orders/:id/cancel - 주문 취소
router.put('/:id/cancel', orderController.cancelOrder);

export default router;

