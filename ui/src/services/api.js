const API_BASE_URL = 'http://localhost:5000/api';

// 에러 처리 헬퍼 함수
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
  }
  
  return data;
};

// 메뉴 API
export const menuAPI = {
  // 모든 메뉴 조회
  getAllMenus: async () => {
    const response = await fetch(`${API_BASE_URL}/menus`);
    return handleResponse(response);
  },
  
  // 특정 메뉴 조회
  getMenuById: async (menuId) => {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}`);
    return handleResponse(response);
  }
};

// 옵션 API
export const optionAPI = {
  // 옵션 목록 조회
  getAllOptions: async (menuId = null) => {
    const url = menuId 
      ? `${API_BASE_URL}/options?menuId=${menuId}`
      : `${API_BASE_URL}/options`;
    const response = await fetch(url);
    return handleResponse(response);
  }
};

// 주문 API
export const orderAPI = {
  // 주문 생성
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  },
  
  // 주문 목록 조회
  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    const url = `${API_BASE_URL}/orders?${params.toString()}`;
    const response = await fetch(url);
    return handleResponse(response);
  },
  
  // 특정 주문 조회
  getOrderById: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    return handleResponse(response);
  },
  
  // 주문 상태 변경
  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },
  
  // 주문 취소 (이전 단계로 되돌리기)
  cancelOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT'
    });
    return handleResponse(response);
  },
  
  // 주문 통계 조회
  getOrderStats: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/stats`);
    return handleResponse(response);
  }
};

// 재고 API
export const stockAPI = {
  // 재고 목록 조회
  getAllStocks: async () => {
    const response = await fetch(`${API_BASE_URL}/stocks`);
    return handleResponse(response);
  },
  
  // 재고 변경
  updateStock: async (menuId, action) => {
    const response = await fetch(`${API_BASE_URL}/stocks/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action })
    });
    return handleResponse(response);
  }
};

