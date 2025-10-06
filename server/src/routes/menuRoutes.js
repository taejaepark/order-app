import express from 'express';
import * as menuController from '../controllers/menuController.js';

const router = express.Router();

// GET /api/menus - 메뉴 목록 조회
router.get('/', menuController.getMenus);

// GET /api/menus/:id - 특정 메뉴 조회
router.get('/:id', menuController.getMenuById);

export default router;

