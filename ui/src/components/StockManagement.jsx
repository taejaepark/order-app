import './StockManagement.css'

function StockManagement({ stocks, onIncrease, onDecrease }) {
  // 재고 상태 판단
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', className: 'out-of-stock' }
    if (stock < 5) return { text: '주의', className: 'low-stock' }
    return { text: '정상', className: 'normal' }
  }

  return (
    <div className="stock-management">
      <h2 className="section-title">재고 현황</h2>
      <div className="stock-cards">
        {stocks.map(stock => {
          const status = getStockStatus(stock.stock)
          return (
            <div key={stock.id} className="stock-card">
              <div className="stock-info">
                <h3 className="stock-menu-name">{stock.menuName}</h3>
                <div className="stock-quantity">
                  <span className="quantity-number">{stock.stock}개</span>
                  <span className={`stock-status ${status.className}`}>
                    {status.text}
                  </span>
                </div>
              </div>
              <div className="stock-controls">
                <button 
                  className="stock-btn decrease"
                  onClick={() => onDecrease(stock.id)}
                  disabled={stock.stock === 0}
                >
                  -
                </button>
                <button 
                  className="stock-btn increase"
                  onClick={() => onIncrease(stock.id)}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StockManagement

