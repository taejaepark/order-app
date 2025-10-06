import { useState } from 'react'
import Dashboard from '../components/Dashboard'
import StockManagement from '../components/StockManagement'
import OrderManagement from '../components/OrderManagement'
import './AdminPage.css'

function AdminPage() {
  // 임시 재고 데이터
  const [stocks, setStocks] = useState([
    { id: 1, menuName: '아메리카노 (ICE)', stock: 10 },
    { id: 2, menuName: '아메리카노 (HOT)', stock: 3 },
    { id: 3, menuName: '카페라떼', stock: 0 }
  ])

  // 임시 주문 데이터
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderTime: '2025-10-06T13:00:00',
      items: [
        { menuName: '아메리카노(ICE)', options: ['샷 추가'], quantity: 1 }
      ],
      totalPrice: 4500,
      status: 'pending' // pending, in_progress, completed
    },
    {
      id: 2,
      orderTime: '2025-10-06T13:15:00',
      items: [
        { menuName: '카페라떼', options: [], quantity: 2 }
      ],
      totalPrice: 10000,
      status: 'pending'
    },
    {
      id: 3,
      orderTime: '2025-10-06T12:45:00',
      items: [
        { menuName: '아메리카노(HOT)', options: ['샷 추가', '시럽 추가'], quantity: 1 }
      ],
      totalPrice: 4500,
      status: 'in_progress'
    }
  ])

  // 재고 증가
  const increaseStock = (menuId) => {
    setStocks(stocks.map(stock => 
      stock.id === menuId ? { ...stock, stock: stock.stock + 1 } : stock
    ))
  }

  // 재고 감소
  const decreaseStock = (menuId) => {
    setStocks(stocks.map(stock => 
      stock.id === menuId && stock.stock > 0 
        ? { ...stock, stock: stock.stock - 1 } 
        : stock
    ))
  }

  // 주문 상태 변경
  const updateOrderStatus = (orderId) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        if (order.status === 'pending') {
          return { ...order, status: 'in_progress' }
        } else if (order.status === 'in_progress') {
          return { ...order, status: 'completed' }
        }
      }
      return order
    }))
  }

  // 통계 계산
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    inProgressOrders: orders.filter(o => o.status === 'in_progress').length,
    completedOrders: orders.filter(o => o.status === 'completed').length
  }

  return (
    <div className="admin-page">
      <Dashboard stats={stats} />
      <StockManagement 
        stocks={stocks}
        onIncrease={increaseStock}
        onDecrease={decreaseStock}
      />
      <OrderManagement 
        orders={orders}
        onUpdateStatus={updateOrderStatus}
      />
    </div>
  )
}

export default AdminPage

