import { query, getClient } from '../config/database.js';
import { decreaseStockByQuantity } from './menuModel.js';

// 주문 번호 생성 함수
const generateOrderNumber = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.getTime().toString().slice(-6);
  return `ORD-${date}-${time}`;
};

// 주문 생성
export const createOrder = async (orderData) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const { items, totalPrice } = orderData;
    const orderNumber = generateOrderNumber();
    
    // 1. 재고 확인 및 차감
    for (const item of items) {
      const stockResult = await decreaseStockByQuantity(item.menuId, item.quantity);
      
      if (!stockResult) {
        throw new Error(`재고 부족: ${item.menuName} (주문 수량: ${item.quantity})`);
      }
    }
    
    // 2. 주문 생성
    const insertSql = `
      INSERT INTO orders (order_number, items, total_amount, status)
      VALUES ($1, $2, $3, $4)
      RETURNING 
        order_id as id,
        order_number as "orderNumber",
        items,
        total_amount as "totalPrice",
        status,
        created_at as "orderTime"
    `;
    
    const result = await client.query(insertSql, [
      orderNumber,
      JSON.stringify(items),
      totalPrice,
      'pending'
    ]);
    
    await client.query('COMMIT');
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// 주문 목록 조회
export const getAllOrders = async (filters = {}) => {
  const { status, limit = 20, offset = 0 } = filters;
  
  let sql = `
    SELECT 
      order_id as id,
      order_number as "orderNumber",
      items,
      total_amount as "totalPrice",
      status,
      created_at as "orderTime",
      updated_at as "updatedAt"
    FROM orders
  `;
  
  const params = [];
  const conditions = [];
  
  if (status) {
    conditions.push(`status = $${params.length + 1}`);
    params.push(status);
  }
  
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  sql += ` ORDER BY created_at DESC`;
  sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);
  
  const result = await query(sql, params);
  
  // 전체 개수 조회
  let countSql = `SELECT COUNT(*) as total FROM orders`;
  if (conditions.length > 0) {
    countSql += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  const countResult = await query(countSql, status ? [status] : []);
  const total = parseInt(countResult.rows[0].total);
  
  return {
    orders: result.rows,
    pagination: {
      total,
      limit,
      offset
    }
  };
};

// 특정 주문 조회
export const getOrderById = async (orderId) => {
  const sql = `
    SELECT 
      order_id as id,
      order_number as "orderNumber",
      items,
      total_amount as "totalPrice",
      status,
      created_at as "orderTime",
      updated_at as "updatedAt"
    FROM orders
    WHERE order_id = $1
  `;
  
  const result = await query(sql, [orderId]);
  return result.rows[0] || null;
};

// 주문 상태 변경
export const updateOrderStatus = async (orderId, newStatus, currentStatus) => {
  // 상태 변경 검증
  const validTransitions = {
    'pending': ['in_progress'],
    'in_progress': ['completed']
  };
  
  if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(newStatus)) {
    throw new Error(`잘못된 상태 변경: ${currentStatus} → ${newStatus}`);
  }
  
  const sql = `
    UPDATE orders
    SET 
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE order_id = $2
    RETURNING 
      order_id as id,
      status,
      updated_at as "updatedAt"
  `;
  
  const result = await query(sql, [newStatus, orderId]);
  return result.rows[0];
};

// 주문 취소 (이전 단계로 되돌리기)
export const cancelOrderStatus = async (orderId, currentStatus) => {
  const cancelTransitions = {
    'in_progress': 'pending',
    'completed': 'in_progress'
  };
  
  const newStatus = cancelTransitions[currentStatus];
  
  if (!newStatus) {
    throw new Error(`취소 불가능한 상태: ${currentStatus}`);
  }
  
  const sql = `
    UPDATE orders
    SET 
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE order_id = $2
    RETURNING 
      order_id as id,
      status,
      updated_at as "updatedAt"
  `;
  
  const result = await query(sql, [newStatus, orderId]);
  return result.rows[0];
};

// 주문 통계 조회
export const getOrderStats = async () => {
  const sql = `
    SELECT 
      COUNT(*) as "totalOrders",
      COUNT(*) FILTER (WHERE status = 'pending') as "pendingOrders",
      COUNT(*) FILTER (WHERE status = 'in_progress') as "inProgressOrders",
      COUNT(*) FILTER (WHERE status = 'completed') as "completedOrders"
    FROM orders
  `;
  
  const result = await query(sql);
  return result.rows[0];
};

