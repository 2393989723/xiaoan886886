import { useRouter } from 'next/router';

export default function AdminHome({ user }) {
  const router = useRouter();

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      {/* 头部 */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <h1 style={{ margin: 0 }}>管理后台</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>管理员：{user.username}</span>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            style={{ 
              padding: '6px 12px', 
              background: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            退出登录
          </button>
        </div>
      </header>

      {/* 功能导航卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '30px' 
      }}>
        <div style={{ 
          padding: '30px', 
          border: '1px solid #eee', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/admin/products')}>
          <h2 style={{ color: '#2196F3' }}>商品管理</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>添加、编辑、删除账号商品</p>
        </div>

        <div style={{ 
          padding: '30px', 
          border: '1px solid #eee', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/admin/users')}>
          <h2 style={{ color: '#4CAF50' }}>用户管理</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>查看用户列表、给用户充值钻石</p>
        </div>

        <div style={{ 
          padding: '30px', 
          border: '1px solid #eee', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/admin/orders')}>
          <h2 style={{ color: '#ff9800' }}>订单管理</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>查看所有用户的购买订单</p>
        </div>

        <div style={{ 
          padding: '30px', 
          border: '1px solid #eee', 
          borderRadius: '8px', 
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/')}>
          <h2 style={{ color: '#9c27b0' }}>访问前台</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>查看用户端商城页面</p>
        </div>
      </div>
    </div>
  );
}
