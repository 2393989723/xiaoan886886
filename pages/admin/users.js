import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllUsers, addDiamondsToUser } from '../../lib/admin';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [rechargeModal, setRechargeModal] = useState({ open: false, userId: '', username: '', amount: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const openRechargeModal = (user) => {
    setRechargeModal({
      open: true,
      userId: user.id,
      username: user.username,
      amount: ''
    });
    setMessage('');
  };

  const handleRecharge = async () => {
    setMessage('');
    if (!rechargeModal.amount || isNaN(Number(rechargeModal.amount)) || Number(rechargeModal.amount) <= 0) {
      setMessage('❌ 请输入有效的充值金额（正数）');
      return;
    }

    const result = await addDiamondsToUser(rechargeModal.userId, Number(rechargeModal.amount));
    if (result.error) {
      setMessage(`❌ ${result.error}`);
      return;
    }

    setMessage(`✅ 给 ${rechargeModal.username} 充值 ${rechargeModal.amount} 钻石成功`);
    setUsers(prev => prev.map(user => 
      user.id === rechargeModal.userId ? { ...user, diamonds: user.diamonds + Number(rechargeModal.amount) } : user
    ));
    setTimeout(() => setRechargeModal({ ...rechargeModal, open: false }), 3000);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>加载用户中...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>用户管理</h2>
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

      {rechargeModal.open && (
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
            maxWidth: '400px' 
          }}>
            <h3 style={{ marginTop: 0 }}>给用户充值钻石</h3>
            <p style={{ marginBottom: '15px' }}>用户名：{rechargeModal.username}</p>
            {message && <div style={{ padding: '10px', marginBottom: '15px', background: message.includes('✅') ? '#dff0d8' : '#f2dede' }}>{message}</div>}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>充值钻石数量</label>
              <input
                type="number"
                min="1"
                value={rechargeModal.amount}
                onChange={(e) => setRechargeModal({ ...rechargeModal, amount: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setRechargeModal({ ...rechargeModal, open: false })}
                style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
              >
                取消
              </button>
              <button 
                onClick={handleRecharge}
                style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                确认充值
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
              <<<<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>用户ID</</</</</th>
              <<<<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>用户名</</</</</th>
              <<<<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>角色</</</</</th>
              <<<<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>当前钻石</</</</</th>
              <<<<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>注册时间</</</</</th>
              <<<<<th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>操作</</</</</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colspan="6" style={{ padding: '20px', border: '1px solid #ddd', textAlign: 'center' }}>暂无用户</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.id.slice(-6)}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.username}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      background: user.role === 'admin' ? '#2196F3' : '#4CAF50', 
                      color: 'white', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.diamonds}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button 
                      onClick={() => openRechargeModal(user)}
                      style={{ 
                        padding: '4px 8px', 
                        background: '#2196F3', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      充值钻石
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
