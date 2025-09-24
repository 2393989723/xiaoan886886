import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { verifyToken, getUserById } from '../lib/auth';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 初始化：检查本地存储的登录状态
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }

      // 获取用户信息并更新状态
      const userData = await getUserById(decoded.userId);
      if (userData) setUser(userData);
      setLoading(false);
    };

    initAuth();
  }, []);

  // 权限控制：未登录跳转登录页，非管理员禁止访问管理后台
  useEffect(() => {
    if (!loading) {
      // 未登录：仅允许访问登录/注册页
      if (!user && !['/login', '/register'].includes(router.pathname)) {
        router.push('/login');
      }
      // 非管理员：禁止访问 /admin 开头的页面
      if (user && router.pathname.startsWith('/admin') && user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [loading, user, router]);

  return loading ? (
    <div style={{ textAlign: 'center', padding: '100px' }}>加载中...</div>
  ) : (
    <Component {...pageProps} user={user} setUser={setUser} />
  );
}

export default MyApp;
