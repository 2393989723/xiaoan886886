import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { kv } from '@vercel/kv';

// 生成登录 Token
export function generateToken(userId) {
  return sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// 验证 Token 有效性
export function verifyToken(token) {
  try {
    return verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// 注册新用户
export async function registerUser(username, password, role = 'user') {
  const existingUser = await kv.get(`user:${username}`);
  if (existingUser) return { error: '用户名已存在' };

  const hashedPassword = await hash(password, 10);
  const userId = `user_${Date.now()}`;
  await kv.set(`user:${username}`, {
    id: userId,
    username,
    password: hashedPassword,
    role,
    diamonds: 0, // 初始钻石为 0
    createdAt: Date.now()
  });
  await kv.set(`userId:${userId}`, username); // 关联用户ID与用户名
  return { success: true, userId };
}

// 用户登录
export async function loginUser(username, password) {
  const user = await kv.get(`user:${username}`);
  if (!user) return { error: '用户名或密码错误' };

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) return { error: '用户名或密码错误' };

  const token = generateToken(user.id);
  return { 
    success: true, 
    token, 
    user: { id: user.id, username, role: user.role, diamonds: user.diamonds } 
  };
}

// 通过用户ID获取用户信息
export async function getUserById(userId) {
  const username = await kv.get(`userId:${userId}`);
  if (!username) return null;
  return kv.get(`user:${username}`);
}
