import './OrderManagement.css'

function OrderManagement({ orders, onUpdateStatus }) {
  // 날짜 포맷팅
  const formatDateTime = (isoString) => {
    const date = new Date(isoString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  // 상태별 버튼 텍스트 및 스타일
  const getStatusButton = (status) => {
    switch (status) {
      case 'pending':
        return { text: '제조 시작', className: 'status-pending' }
      case 'in_progress':
        return { text: '제조 완료', className: 'status-in-progress' }
      case 'completed':
        return { text: '완료됨', className: 'status-completed', disabled: true }
      default:
        return { text: '알 수 없음', className: '', disabled: true }
    }
  }

  // 상태별 배지
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { text: '주문 접수', className: 'badge-pending' }
      case 'in_progress':
        return { text: '제조 중', className: 'badge-in-progress' }
      case 'completed':
        return { text: '제조 완료', className: 'badge-completed' }
      default:
        return { text: '알 수 없음', className: '' }
    }
  }

  // 시간순 정렬 (최신순)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.orderTime) - new Date(a.orderTime)
  )

  return (
    <div className="order-management">
      <h2 className="section-title">주문 현황</h2>
      <div className="order-list">
        {sortedOrders.length === 0 ? (
          <p className="no-orders">주문이 없습니다</p>
        ) : (
          sortedOrders.map(order => {
            const statusButton = getStatusButton(order.status)
            const statusBadge = getStatusBadge(order.status)
            
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-time">{formatDateTime(order.orderTime)}</span>
                  <span className={`order-badge ${statusBadge.className}`}>
                    {statusBadge.text}
                  </span>
                </div>
                
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">
                        {item.menuName}
                        {item.options.length > 0 && (
                          <span className="item-options">
                            {' '}({item.options.join(', ')})
                          </span>
                        )}
                        {' '}× {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span className="order-price">{order.totalPrice.toLocaleString()}원</span>
                  <button 
                    className={`order-status-btn ${statusButton.className}`}
                    onClick={() => onUpdateStatus(order.id)}
                    disabled={statusButton.disabled}
                  >
                    {statusButton.text}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default OrderManagement

