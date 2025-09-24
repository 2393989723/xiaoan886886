import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllOrders } from '../../lib/admin';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
              <<th style={{ padding: '12px', border: '1px solid #ddd', textAl
