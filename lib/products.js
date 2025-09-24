import { kv } from '@vercel/kv';
import { getUserById } from './auth';

// 获取所有上架商品
export async function getAllProducts() {
  const productIds = await kv.zrange('products:ids', 0, -1);
  const products = [];
  for (const id of productIds) {
    const product = await kv.get(`product:${id}`);
    if (product && product.isActive) products.push(product);
  }
  return products;
}

// 管理员添加商品
export async function addProduct(name, price, diamondCost, accountInfo) {
  const productId = `prod_${Date.now()}`;
  const product = {
    id: productId,
    name, // 商品名称（如“王者荣耀V8账号”）
    price, // 实际价格（元）
    diamondCost, // 钻石价格（购买需消耗的钻石）
    accountInfo, // 账号信息（如“QQ区，带10款限定皮肤”）
    createdAt: Date.now(),
    isActive: true // 是否上架
  };
  await kv.set(`product:${productId}`, product);
  await kv.zadd('products:ids', { score: Date.now(), member: productId });
  return product;
}

// 管理员编辑商品
export async function editProduct(productId, data) {
  const product = await kv.get(`product:${productId}`);
  if (!product) return { error: '商品不存在' };

  const updatedProduct = { ...product, ...data };
  await kv.set(`product:${productId}`, updatedProduct);
  return { success: true, product: updatedProduct };
}

// 管理员删除商品
export async function deleteProduct(productId) {
  await kv.del(`product:${productId}`);
  await kv.zrem('products:ids', productId);
  return { success: true };
}

// 用户购买商品（扣钻石+生成订单）
export async function buyProduct(userId, productId) {
  // 1. 验证用户和商品
  const user = await getUserById(userId);
  const product = await kv.get(`product:${productId}`);
  if (!user || !product) return { error: '用户或商品不存在' };
  if (!product.isActive) return { error: '商品已下架' };

  // 2. 检查钻石是否足够
  if (user.diamonds < product.diamondCost) return { error: '钻石不足，请联系客服充值' };

  // 3. 扣减钻石并更新用户信息
  user.diamonds -= product.diamondCost;
  await kv.set(`user:${user.username}`, user);

  // 4. 生成订单记录
  const orderId = `order_${Date.now()}`;
  const order = {
    id: orderId,
    userId,
    productId,
    productName: product.name,
    diamondCost: product.diamondCost,
    status: 'completed', // 订单状态：completed（完成）
    createdAt: Date.now()
  };
  await kv.set(`order:${orderId}`, order);
  await kv.zadd(`orders:${userId}`, { score: Date.now(), member: orderId }); // 用户订单列表
  await kv.zadd('all:orders', { score: Date.now(), member: orderId }); // 所有订单（供管理员查看）

  return { 
    success: true, 
    order, 
    accountInfo: product.accountInfo // 返回购买的账号信息
  };
}
