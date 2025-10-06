import * as optionModel from '../models/optionModel.js';

// GET /api/options - 옵션 목록 조회
export const getOptions = async (req, res, next) => {
  try {
    const { menuId } = req.query;
    const options = await optionModel.getAllOptions(menuId);
    
    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    next(error);
  }
};

