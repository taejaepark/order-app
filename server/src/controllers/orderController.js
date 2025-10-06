import * as orderModel from '../models/orderModel.js';

// POST /api/orders - 주문 생성
export const createOrder = async (req, res, next) => {
  try {
    const { items, totalPrice } = req.body;
    
    // 입력 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: '주문 항목이 필요합니다.'
      });
    }
    
    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: '총 금액이 올바르지 않습니다.'
      });
    }
    
    const order = await orderModel.createOrder({ items, totalPrice });
    
    res.status(201).json({
      success: true,
      data: order,
      message: '주문이 완료되었습니다.'
    });
  } catch (error) {
    if (error.message.includes('재고 부족')) {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

// GET /api/orders - 주문 목록 조회
export const getOrders = async (req, res, next) => {
  try {
    const { status, limit, offset } = req.query;
    
    const filters = {
      status,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0
    };
    
    const result = await orderModel.getAllOrders(filters);
    
    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id - 특정 주문 조회
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderModel.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status - 주문 상태 변경
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;
    
    if (!newStatus) {
      return res.status(400).json({
        success: false,
        error: '상태 값이 필요합니다.'
      });
    }
    
    // 현재 주문 조회
    const currentOrder = await orderModel.getOrderById(id);
    
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }
    
    const updatedOrder = await orderModel.updateOrderStatus(
      id, 
      newStatus, 
      currentOrder.status
    );
    
    res.json({
      success: true,
      data: updatedOrder,
      message: '주문 상태가 변경되었습니다.'
    });
  } catch (error) {
    if (error.message.includes('잘못된 상태 변경')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

// PUT /api/orders/:id/cancel - 주문 취소 (이전 단계로 되돌리기)
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 현재 주문 조회
    const currentOrder = await orderModel.getOrderById(id);
    
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }
    
    const updatedOrder = await orderModel.cancelOrderStatus(
      id, 
      currentOrder.status
    );
    
    res.json({
      success: true,
      data: updatedOrder,
      message: '주문 상태가 취소되었습니다.'
    });
  } catch (error) {
    if (error.message.includes('취소 불가능')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

// GET /api/orders/stats - 주문 통계 조회
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await orderModel.getOrderStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

