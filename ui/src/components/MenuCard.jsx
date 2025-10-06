import { useState } from 'react'
import './MenuCard.css'

function MenuCard({ menu, options, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  // 옵션 선택/해제
  const toggleOption = (option) => {
    const isSelected = selectedOptions.find(opt => opt.id === option.id)
    
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter(opt => opt.id !== option.id))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  // 담기 버튼 클릭
  const handleAddToCart = () => {
    onAddToCart(menu, selectedOptions)
    setSelectedOptions([]) // 옵션 초기화
  }

  return (
    <div className="menu-card">
      <div className="menu-image">
        {menu.image ? (
          <img src={menu.image} alt={menu.name} className="menu-image-img" />
        ) : (
          <div className="image-placeholder">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <line x1="0" y1="0" x2="100" y2="100" stroke="#ccc" strokeWidth="2"/>
              <line x1="100" y1="0" x2="0" y2="100" stroke="#ccc" strokeWidth="2"/>
            </svg>
          </div>
        )}
      </div>
      
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
      </div>

      <div className="menu-options">
        {options.map(option => (
          <label key={option.id} className="option-checkbox">
            <input
              type="checkbox"
              checked={selectedOptions.find(opt => opt.id === option.id) !== undefined}
              onChange={() => toggleOption(option)}
            />
            <span>{option.name} (+{option.price}원)</span>
          </label>
        ))}
      </div>

      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        담기
      </button>
    </div>
  )
}

export default MenuCard

