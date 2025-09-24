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

  if (loading) return <div style={{ textAlign: 'c
