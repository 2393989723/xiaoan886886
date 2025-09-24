import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../lib/auth';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 验证输入
    if (!username.trim() || !password.trim()) {
      setError('请填写用户名和密码');
      setLoading(false);
      return;
    }

    // 调用登录接口
    const result = await loginUser(username, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // 登录成功：存储Token+更新用户状态+跳转首页
    localStorage.setItem('token', result.token);
    setUser(result.user);
    router.push('/');
    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '80px auto', 
      padding: '25px', 
      border: '1px solid #eee', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>账号登录</h2>
      
      {/* 错误提示 */}
      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          background: '#f2dede', 
          color: '#a94442',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {/* 登录表单 */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>用户名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '登录中...' : '登录'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          还没有账号？<a href="/register" style={{ color: '#2196F3' }}>立即注册</a>
        </p>
      </form>
    </div>
  );
}
