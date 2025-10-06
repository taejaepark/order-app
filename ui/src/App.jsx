import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('order')

  return (
    <div className="app">
      <header className="header">
        <div className="brand-logo">T,J</div>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => setActiveTab('order')}
          >
            주문하기
          </button>
          <button 
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            관리자
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'order' ? <OrderPage /> : <AdminPage />}
      </main>
    </div>
  )
}

export default App
