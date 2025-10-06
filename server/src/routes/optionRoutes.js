import express from 'express';
import * as optionController from '../controllers/optionController.js';

const router = express.Router();

// GET /api/options - 옵션 목록 조회
router.get('/', optionController.getOptions);

export default router;

