import { useState, useEffect } from 'react'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'
import { menuAPI, optionAPI, orderAPI } from '../services/api'
import './OrderPage.css'

function OrderPage() {
  const [menuItems, setMenuItems] = useState([])
  const [options, setOptions] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 메뉴와 옵션 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 메뉴와 옵션 동시에 가져오기
        const [menusResponse, optionsResponse] = await Promise.all([
          menuAPI.getAllMenus(),
          optionAPI.getAllOptions()
        ])
        
        setMenuItems(menusResponse.data)
        setOptions(optionsResponse.data)
      } catch (err) {
        setError(err.message)
        console.error('데이터 로드 실패:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // 장바구니에 아이템 추가
  const addToCart = (menuItem, selectedOptions) => {
    const cartItem = {
      menuId: menuItem.id,
      menuName: menuItem.name,
      basePrice: menuItem.price,
      options: selectedOptions,
      quantity: 1,
      totalPrice: menuItem.price + selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
    }

    // 같은 메뉴 + 같은 옵션 조합이 있는지 확인
    const existingItemIndex = cart.findIndex(item => 
      item.menuId === cartItem.menuId &&
      JSON.stringify(item.options) === JSON.stringify(cartItem.options)
    )

    if (existingItemIndex >= 0) {
      // 기존 항목의 수량 증가
      const newCart = [...cart]
      newCart[existingItemIndex].quantity += 1
      setCart(newCart)
    } else {
      // 새 항목 추가
      setCart([...cart, cartItem])
    }
  }

  // 장바구니 수량 증가
  const increaseQuantity = (index) => {
    const newCart = [...cart]
    newCart[index].quantity += 1
    setCart(newCart)
  }

  // 장바구니 수량 감소
  const decreaseQuantity = (index) => {
    const newCart = [...cart]
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1
      setCart(newCart)
    }
  }

  // 장바구니 아이템 삭제
  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
  }

  // 주문하기
  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다')
      return
    }
    
    try {
      // 주문 데이터 준비
      const orderData = {
        items: cart.map(item => ({
          menuId: item.menuId,
          menuName: item.menuName,
          basePrice: item.basePrice,
          quantity: item.quantity,
          options: item.options.map(opt => ({
            optionId: opt.id,
            optionName: opt.name,
            optionPrice: opt.price
          }))
        })),
        totalPrice: cart.reduce((sum, item) => {
          const itemTotal = (item.basePrice + item.options.reduce((s, opt) => s + opt.price, 0)) * item.quantity
          return sum + itemTotal
        }, 0)
      }
      
      // 서버에 주문 생성 요청
      const response = await orderAPI.createOrder(orderData)
      
      alert(`주문이 완료되었습니다!\n주문번호: ${response.data.orderNumber}`)
      setCart([])
      
      // 메뉴 재로드 (재고 업데이트 반영)
      const menusResponse = await menuAPI.getAllMenus()
      setMenuItems(menusResponse.data)
    } catch (err) {
      alert(`주문 실패: ${err.message}`)
      console.error('주문 실패:', err)
    }
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="order-page">
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>
          메뉴를 불러오는 중...
        </div>
      </div>
    )
  }
  
  // 에러 상태
  if (error) {
    return (
      <div className="order-page">
        <div style={{ textAlign: 'center', padding: '50px', color: '#dc3545' }}>
          <h3>데이터를 불러오는데 실패했습니다</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
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
    <div className="order-page">
      <div className="menu-grid">
        {menuItems.map(menu => (
          <MenuCard 
            key={menu.id}
            menu={menu}
            options={options}
            onAddToCart={addToCart}
          />
        ))}
      </div>
      
      <Cart 
        cart={cart}
        onOrder={handleOrder}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  )
}

export default OrderPage

