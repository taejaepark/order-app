import { useState, useEffect } from 'react'
import Dashboard from '../components/Dashboard'
import StockManagement from '../components/StockManagement'
import OrderManagement from '../components/OrderManagement'
import { stockAPI, orderAPI } from '../services/api'
import './AdminPage.css'

function AdminPage() {
  const [stocks, setStocks] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 데이터 로드 함수
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 재고, 주문, 통계 동시에 가져오기
      const [stocksResponse, ordersResponse, statsResponse] = await Promise.all([
        stockAPI.getAllStocks(),
        orderAPI.getAllOrders({ limit: 100 }),
        orderAPI.getOrderStats()
      ])
      
      setStocks(stocksResponse.data)
      setOrders(ordersResponse.data)
      setStats(statsResponse.data)
    } catch (err) {
      setError(err.message)
      console.error('데이터 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    fetchData()
  }, [])

  // 재고 증가
  const increaseStock = async (menuId) => {
    try {
      const response = await stockAPI.updateStock(menuId, 'increase')
      
      // UI 업데이트
      setStocks(stocks.map(stock => 
        stock.menuId === menuId ? response.data : stock
      ))
    } catch (err) {
      alert(`재고 증가 실패: ${err.message}`)
      console.error('재고 증가 실패:', err)
    }
  }

  // 재고 감소
  const decreaseStock = async (menuId) => {
    try {
      const response = await stockAPI.updateStock(menuId, 'decrease')
      
      // UI 업데이트
      setStocks(stocks.map(stock => 
        stock.menuId === menuId ? response.data : stock
      ))
    } catch (err) {
      alert(`재고 감소 실패: ${err.message}`)
      console.error('재고 감소 실패:', err)
    }
  }

  // 주문 상태 변경
  const updateOrderStatus = async (orderId) => {
    try {
      const currentOrder = orders.find(o => o.id === orderId)
      if (!currentOrder) return
      
      let newStatus
      if (currentOrder.status === 'pending') {
        newStatus = 'in_progress'
      } else if (currentOrder.status === 'in_progress') {
        newStatus = 'completed'
      } else {
        return
      }
      
      await orderAPI.updateOrderStatus(orderId, newStatus)
      
      // UI 업데이트
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
      // 통계 업데이트
      const statsResponse = await orderAPI.getOrderStats()
      setStats(statsResponse.data)
    } catch (err) {
      alert(`주문 상태 변경 실패: ${err.message}`)
      console.error('주문 상태 변경 실패:', err)
    }
  }

  // 주문 상태 취소 (이전 단계로 되돌리기)
  const cancelOrderStatus = async (orderId) => {
    try {
      await orderAPI.cancelOrder(orderId)
      
      // UI 업데이트
      const currentOrder = orders.find(o => o.id === orderId)
      let newStatus
      if (currentOrder.status === 'in_progress') {
        newStatus = 'pending'
      } else if (currentOrder.status === 'completed') {
        newStatus = 'in_progress'
      } else {
        return
      }
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
      // 통계 업데이트
      const statsResponse = await orderAPI.getOrderStats()
      setStats(statsResponse.data)
    } catch (err) {
      alert(`주문 취소 실패: ${err.message}`)
      console.error('주문 취소 실패:', err)
    }
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>
          데이터를 불러오는 중...
        </div>
      </div>
    )
  }
  
  // 에러 상태
  if (error) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: '50px', color: '#dc3545' }}>
          <h3>데이터를 불러오는데 실패했습니다</h3>
          <p>{error}</p>
          <button 
            onClick={fetchData}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    )
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
        onCancelStatus={cancelOrderStatus}
      />
    </div>
  )
}

export default AdminPage

