import { useState } from 'react'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'
import './OrderPage.css'

// 임시 메뉴 데이터
const menuItems = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '깔끔한 설명...',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '깔끔한 설명...',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '깔끔한 설명...',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '부드러운 우유 거품이 일품인 커피',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: '바닐라라떼',
    price: 5500,
    description: '달콤한 바닐라 향이 가득한 라떼',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    name: '카라멜 마키아또',
    price: 5500,
    description: '달콤한 카라멜과 에스프레소의 조화',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=300&fit=crop'
  }
]

// 옵션 데이터
const options = [
  { id: 1, name: '샷 추가', price: 500 },
  { id: 2, name: '시럽 추가', price: 0 }
]

function OrderPage() {
  const [cart, setCart] = useState([])

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

  // 주문하기
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다')
      return
    }
    
    alert('주문이 완료되었습니다!')
    setCart([])
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
      />
    </div>
  )
}

export default OrderPage

