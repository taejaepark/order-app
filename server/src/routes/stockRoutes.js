import express from 'express';
import * as stockController from '../controllers/stockController.js';

const router = express.Router();

// GET /api/stocks - 재고 목록 조회
router.get('/', stockController.getStocks);

// PUT /api/stocks/:menuId - 재고 변경
router.put('/:menuId', stockController.updateStock);

export default router;

