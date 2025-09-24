import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllProducts, buyProduct } from '../lib/products';

export default function Home({ user, setUser }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 加载商品列表
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // 购买商品
  const handleBuy = async (productId) => {
    setMessage('');
    const result = await buyProduct(user.id, productId);
    if (result.error) {
      setMessage(`❌ ${result.error}`);
      return;
    }

    // 购买成功：显示账号信息+更新用户钻石
    setMessage(`✅ 购买成功！账号信息：\n${result.accountInfo}`);
    setUser(prev => ({ ...prev, diamonds: prev.diamonds - result.order.diamondCost }));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>加载商品中...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* 头部：用户信息+操作按钮 */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <h1 style={{ margin: 0 }}>账号购买商城</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>欢迎，{user.username} | 钻石：{user.diamonds}</span>
          <button 
            onClick={() => router.push('/recharge')}
            style={{ 
              padding: '6px 12px', 
              background: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            联系客服充值
          </button>
          {user.role === 'admin' && (
            <button 
              onClick={() => router.push('/admin')}
              style={{ 
                padding: '6px 12px', 
                background: '#2196F3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              管理后台
            </button>
          )}
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              setUser(null);
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

      {/* 消息提示（购买成功/失败） */}
      {message && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px', 
          borderRadius: '4px',
          background: message.includes('✅') ? '#dff0d8' : '#f2dede',
          whiteSpace: 'pre-wrap' // 保留换行
        }}>
          {message}
        </div>
      )}

      {/* 商品列表 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {products.length === 0 ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>暂无商品上架</p>
        ) : (
          products.map(product => (
            <div key={product.id} style={{ 
              border: '1px solid #eee', 
              padding: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ marginTop: 0 }}>{product.name}</h3>
              <p style={{ margin: '8px 0' }}>实际价格：{product.price}元</p>
              <p style={{ margin: '8px 0' }}>钻石价格：{product.diamondCost}钻石</p>
              <p style={{ margin: '8px 0', color: '#666' }}>账号信息：{product.accountInfo}</p>
              <button 
                onClick={() => handleBuy(product.id)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: '#2196F3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                立即购买
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
