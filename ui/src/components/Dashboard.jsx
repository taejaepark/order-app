import './Dashboard.css'

function Dashboard({ stats }) {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-label">총 주문</span>
          <span className="stat-value">{stats.totalOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">주문 접수</span>
          <span className="stat-value pending">{stats.pendingOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">제조 중</span>
          <span className="stat-value in-progress">{stats.inProgressOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">제조 완료</span>
          <span className="stat-value completed">{stats.completedOrders}</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

