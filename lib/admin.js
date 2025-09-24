import { kv } from '@vercel/kv';
import { getUserById } from './auth';

// 给用户充值钻石（管理员操作）
export async function addDiamondsToUser(userId, amount) {
  if (amount <= 0) return { error: '充值钻石数量必须大于0' };

  const user = await getUserById(userId);
  if (!user) return { error: '用户不存在' };

  // 更新用户钻石
  user.diamonds += amount;
  await kv.set(`user:${user.username}`, user);

  // 记录充值日志
  const recordId = `recharge_${Date.now()}`;
  await kv.set(`recharge:${recordId}`, {
    id: recordId,
    userId,
    username: user.username,
    amount,
    operator: 'admin', // 操作人（管理员）
    createdAt: Date.now()
  });
  await kv.zadd('all:recharges', { score: Date.now(), member: recordId });

  return { 
    success: true, 
    user: { id: user.id, username: user.username, diamonds: user.diamonds } 
  };
}

// 管理员获取所有用户列表
export async function getAllUsers() {
  const userKeys = await kv.keys('user:*');
  const users = [];
  for (const key of userKeys) {
    const user = await kv.get(key);
    if (user) users.push({ 
      id: user.id, 
      username: user.username, 
      role: user.role, 
      diamonds: user.diamonds, 
      createdAt: user.createdAt 
    });
  }
  return users;
}

// 管理员获取所有订单
export async function getAllOrders() {
  const orderIds = await kv.zrange('all:orders', 0, -1, { rev: true }); // 倒序（最新在前）
  const orders = [];
  for (const id of orderIds) {
    const order = await kv.get(`order:${id}`);
    if (order) {
      const user = await getUserById(order.userId);
      orders.push({ ...order, username: user?.username || '未知用户' });
    }
  }
  return orders;
}
