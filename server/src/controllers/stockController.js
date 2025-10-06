import * as menuModel from '../models/menuModel.js';

// GET /api/stocks - 재고 목록 조회
export const getStocks = async (req, res, next) => {
  try {
    const menus = await menuModel.getAllMenus();
    
    const stocks = menus.map(menu => {
      let status = '정상';
      if (menu.stock === 0) {
        status = '품절';
      } else if (menu.stock < 5) {
        status = '주의';
      }
      
      return {
        menuId: menu.id,
        menuName: menu.name,
        stock: menu.stock,
        status
      };
    });
    
    res.json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/stocks/:menuId - 재고 변경
export const updateStock = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    const { action } = req.body;
    
    if (!action || !['increase', 'decrease'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'action은 increase 또는 decrease여야 합니다.'
      });
    }
    
    let updatedMenu;
    
    if (action === 'increase') {
      updatedMenu = await menuModel.increaseStock(menuId);
    } else {
      updatedMenu = await menuModel.decreaseStock(menuId);
      
      if (!updatedMenu) {
        return res.status(400).json({
          success: false,
          error: '재고가 부족합니다.',
          data: {
            menuId: parseInt(menuId),
            currentStock: 0
          }
        });
      }
    }
    
    // 상태 결정
    let status = '정상';
    if (updatedMenu.stock === 0) {
      status = '품절';
    } else if (updatedMenu.stock < 5) {
      status = '주의';
    }
    
    res.json({
      success: true,
      data: {
        menuId: updatedMenu.id,
        menuName: updatedMenu.name,
        stock: updatedMenu.stock,
        available: updatedMenu.available,
        status
      },
      message: '재고가 업데이트되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

