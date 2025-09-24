import { useRouter } from 'next/router';

export default function Recharge({ user }) {
  const router = useRouter();

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '80px auto', 
      padding: '25px', 
      border: '1px solid #eee', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>钻石充值</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>当前账号信息</h3>
        <p>用户名：{user.username}</p>
        <p>当前钻石：{user.diamonds}</p>
      </div>

      <div style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0, color: '#d35400' }}>充值流程</h3>
        <ol style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}>联系客服，告知你的用户名和充值金额（如“用户名：xxx，充值100钻石”）</li>
          <li style={{ marginBottom: '10px' }}>按客服提示完成支付（支持微信/支付宝）</li>
          <li style={{ marginBottom: '10px' }}>支付完成后，客服会在10分钟内为你添加钻石</li>
          <li>返回首页查看钻石到账情况</li>
        </ol>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>客服联系方式</h3>
        <p>微信：xiaoan886886_kf（备注“账号充值”）</p>
        <p>QQ：123456789（备注“账号充值”）</p>
        <p>客服在线时间：9:00-22:00</p>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button 
          onClick={() => router.push('/')}
          style={{ 
            padding: '10px 20px', 
            background: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          返回首页
        </button>
      </div>
    </div>
  );
}
