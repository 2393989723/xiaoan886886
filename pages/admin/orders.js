import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllOrders } from '../../lib/admin';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 加载订单列表
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>加载订单中...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>订单管理</h2>
        <button 
          onClick={() => router.push('/admin')}
          style={{ 
            padding: '8px 16px', 
            background: '#ccc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          返回后台首页
        </button>
      </header>

      {/* 订单列表表格 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginTop: '20px' 
        }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>订单ID</</th>
              <<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>用户名</</th>
              <<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>购买商品</</th>
              <<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>消耗钻石</</th>
              <<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>订单状态</</th>
              <<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>购买时间</</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colspan="6" style={{ padding: '20px', border: '1px solid #ddd', textAlign: 'center' }}>暂无订单</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.id.slice(-8)}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.username}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.productName}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.diamondCost}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      background: '#4CAF50', 
                      color: 'white', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {order.status === 'completed' ? '已完成' : '已过期'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
