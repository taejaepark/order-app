import * as menuModel from '../models/menuModel.js';

// GET /api/menus - 메뉴 목록 조회
export const getMenus = async (req, res, next) => {
  try {
    const menus = await menuModel.getAllMenus();
    
    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/menus/:id - 특정 메뉴 조회
export const getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await menuModel.getMenuById(id);
    
    if (!menu) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: menu
    });
  } catch (error) {
    next(error);
  }
};

