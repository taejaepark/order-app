import { query } from '../config/database.js';

// 모든 옵션 조회 (menuId로 필터 가능)
export const getAllOptions = async (menuId = null) => {
  let sql = `
    SELECT 
      option_id as id,
      menu_id as "menuId",
      name,
      price
    FROM options
  `;
  
  const params = [];
  
  if (menuId) {
    sql += ` WHERE menu_id = $1`;
    params.push(menuId);
  }
  
  sql += ` ORDER BY option_id ASC`;
  
  const result = await query(sql, params);
  return result.rows;
};

// 특정 옵션 조회
export const getOptionById = async (optionId) => {
  const sql = `
    SELECT 
      option_id as id,
      menu_id as "menuId",
      name,
      price
    FROM options
    WHERE option_id = $1
  `;
  
  const result = await query(sql, [optionId]);
  return result.rows[0] || null;
};

