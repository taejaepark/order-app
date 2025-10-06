import { query } from '../config/database.js';

// 모든 메뉴 조회
export const getAllMenus = async () => {
  const sql = `
    SELECT 
      menu_id as id,
      name,
      description,
      price,
      image_url as image,
      stock_quantity as stock,
      is_available as available,
      created_at,
      updated_at
    FROM menus
    ORDER BY menu_id ASC
  `;
  
  const result = await query(sql);
  return result.rows;
};

// 특정 메뉴 조회 (옵션 포함)
export const getMenuById = async (menuId) => {
  // 메뉴 정보 조회
  const menuSql = `
    SELECT 
      menu_id as id,
      name,
      description,
      price,
      image_url as image,
      stock_quantity as stock,
      is_available as available
    FROM menus
    WHERE menu_id = $1
  `;
  
  const menuResult = await query(menuSql, [menuId]);
  
  if (menuResult.rows.length === 0) {
    return null;
  }
  
  const menu = menuResult.rows[0];
  
  // 해당 메뉴의 옵션 조회
  const optionsSql = `
    SELECT 
      option_id as id,
      name,
      price
    FROM options
    WHERE menu_id = $1
    ORDER BY option_id ASC
  `;
  
  const optionsResult = await query(optionsSql, [menuId]);
  menu.options = optionsResult.rows;
  
  return menu;
};

// 재고 수량 업데이트
export const updateMenuStock = async (menuId, newStock) => {
  const sql = `
    UPDATE menus
    SET 
      stock_quantity = $1,
      is_available = CASE WHEN $1 > 0 THEN true ELSE false END,
      updated_at = CURRENT_TIMESTAMP
    WHERE menu_id = $2
    RETURNING 
      menu_id as id,
      name,
      stock_quantity as stock,
      is_available as available
  `;
  
  const result = await query(sql, [newStock, menuId]);
  return result.rows[0];
};

// 재고 증가
export const increaseStock = async (menuId) => {
  const sql = `
    UPDATE menus
    SET 
      stock_quantity = stock_quantity + 1,
      is_available = true,
      updated_at = CURRENT_TIMESTAMP
    WHERE menu_id = $1
    RETURNING 
      menu_id as id,
      name,
      stock_quantity as stock,
      is_available as available
  `;
  
  const result = await query(sql, [menuId]);
  return result.rows[0];
};

// 재고 감소
export const decreaseStock = async (menuId) => {
  const sql = `
    UPDATE menus
    SET 
      stock_quantity = GREATEST(stock_quantity - 1, 0),
      is_available = CASE WHEN stock_quantity - 1 > 0 THEN true ELSE false END,
      updated_at = CURRENT_TIMESTAMP
    WHERE menu_id = $1 AND stock_quantity > 0
    RETURNING 
      menu_id as id,
      name,
      stock_quantity as stock,
      is_available as available
  `;
  
  const result = await query(sql, [menuId]);
  
  if (result.rows.length === 0) {
    return null; // 재고가 이미 0이거나 메뉴가 없음
  }
  
  return result.rows[0];
};

// 재고 차감 (주문 시)
export const decreaseStockByQuantity = async (menuId, quantity) => {
  const sql = `
    UPDATE menus
    SET 
      stock_quantity = GREATEST(stock_quantity - $2, 0),
      is_available = CASE WHEN stock_quantity - $2 > 0 THEN true ELSE false END,
      updated_at = CURRENT_TIMESTAMP
    WHERE menu_id = $1 AND stock_quantity >= $2
    RETURNING 
      menu_id as id,
      name,
      stock_quantity as stock,
      is_available as available
  `;
  
  const result = await query(sql, [menuId, quantity]);
  
  if (result.rows.length === 0) {
    return null; // 재고 부족
  }
  
  return result.rows[0];
};

