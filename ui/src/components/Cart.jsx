import './Cart.css'

function Cart({ cart, onOrder, onIncreaseQuantity, onDecreaseQuantity, onRemoveItem }) {
  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => 
    sum + (item.totalPrice * item.quantity), 0
  )

  return (
    <div className="cart">
      <div className="cart-content">
        <div className="cart-left">
          <h2 className="cart-title">장바구니</h2>
          
          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="cart-empty">장바구니가 비어있습니다</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">
                      {item.menuName}
                      {item.options.length > 0 && (
                        <span className="cart-item-options">
                          {' '}({item.options.map(opt => opt.name).join(', ')})
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <span className="cart-item-price">
                    {(item.totalPrice * item.quantity).toLocaleString()}원
                  </span>
                  
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => onDecreaseQuantity(index)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => onIncreaseQuantity(index)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveItem(index)}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="cart-right">
          <div className="cart-total">
            <span className="cart-total-label">총 금액</span>
            <span className="cart-total-amount">{totalAmount.toLocaleString()}원</span>
          </div>

          <button 
            className="order-btn"
            onClick={onOrder}
            disabled={cart.length === 0}
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart

