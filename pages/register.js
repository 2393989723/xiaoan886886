import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../lib/auth';

export default function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 验证输入
    if (!username.trim() || !password.trim() || !confirmPwd.trim()) {
      setError('请填写所有字段');
      setLoading(false);
      return;
    }
    if (password !== confirmPwd) {
      setError('两次密码不一致');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('密码长度不能少于6位');
      setLoading(false);
      return;
    }

    // 调用注册接口
    const result = await registerUser(username, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // 注册成功：提示并跳转登录页
    setSuccess('注册成功！即将跳转到登录页...');
    setTimeout(() => router.push('/login'), 2000);
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
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>账号注册</h2>
      
      {/* 提示信息 */}
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
      {success && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          background: '#dff0d8', 
          color: '#3c763d',
          borderRadius: '4px'
        }}>
          {success}
        </div>
      )}

      {/* 注册表单 */}
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
        <div style={{ marginBottom: '20px' }}>
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
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>确认密码</label>
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
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
            background: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '注册中...' : '注册'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          已有账号？<a href="/login" style={{ color: '#2196F3' }}>立即登录</a>
        </p>
      </form>
    </div>
  );
}
