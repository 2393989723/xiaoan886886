import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllProducts, addProduct, editProduct, deleteProduct } from '../../lib/products';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', diamondCost: '', accountInfo: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    setMessage('');
    if (!newProduct.name || !newProduct.price || !newProduct.diamondCost || !newProduct.accountInfo) {
      setMessage('❌ 请填写所有字段');
      return;
    }
    if (isNaN(Number(newProduct.price)) || Number(newProduct.price) <= 0) {
      setMessage('❌ 实际价格必须是正数');
      return;
    }
    if (isNaN(Number(newProduct.diamondCost)) || Number(newProduct.diamondCost) <= 0) {
      setMessage('❌ 钻石价格必须是正数');
      return;
    }

    await addProduct(
      newProduct.name,
      Number(newProduct.price),
      Number(newProduct.diamondCost),
      newProduct.accountInfo
    );
    setMessage('✅ 商品添加成功');
    setNewProduct({ name: '', price: '', diamondCost: '', accountInfo: '' });
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleToggleActive = async (productId, currentStatus) => {
    const result = await editProduct(productId, { isActive: !currentStatus });
    if (result.success) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, isActive: !currentStatus } : p));
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('确定要删除该商品吗？删除后不可恢复！')) return;
    const result = await deleteProduct(productId);
    if (result.success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>加载商品中...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>商品管理</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          style={{ 
            padding: '8px 16px', 
            background: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          添加商品
        </button>
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

      {isAddModalOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: 'white', 
            padding: '25px', 
            borderRadius: '8px', 
            width: '90%', 
            maxWidth: '500px' 
          }}>
            <h3 style={{ marginTop: 0 }}>添加新商品</h3>
            {message && <div style={{ padding: '10px', marginBottom: '15px', background: message.includes('✅') ? '#dff0d8' : '#f2dede' }}>{message}</div>}
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>商品名称</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>实际价格（元）</label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>钻石价格</label>
              <input
                type="number"
                min="1"
                value={newProduct.diamondCost}
                onChange={(e) => setNewProduct({ ...newProduct, diamondCost: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>账号信息</label>
              <textarea
                value={newProduct.accountInfo}
                onChange={(e) => setNewProduct({ ...newProduct, accountInfo: e.target.value })}
                rows="3"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
              >
                取消
              </button>
              <button 
                onClick={handleAddProduct}
                style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginTop: '20px' 
        }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</</</th>
              <<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>商品名称</</</th>
              <<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>实际价格（元）</</</th>
              <<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>钻石价格</</</th>
              <<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>上架状态</</</th>
              <<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>操作</</</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colspan="6" style={{ padding: '20px', border: '1px solid #ddd', textAlign: 'center' }}>暂无商品</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.id.slice(-6)}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.price}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.diamondCost}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button 
                      onClick={() => handleToggleActive(product.id, product.isActive)}
                      style={{ 
                        padding: '4px 8px', 
                        background: product.isActive ? '#4CAF50' : '#f44336', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      {product.isActive ? '已上架' : '已下架'}
                    </button>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      style={{ 
                        padding: '4px 8px', 
                        background: '#f44336', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      删除
                    </button>
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
