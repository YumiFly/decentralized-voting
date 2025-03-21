import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Row, Col, Typography, Button, message } from 'antd';
import { WalletOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [phoneLogin, setPhoneLogin] = useState<string | null>(localStorage.getItem('phoneLogin'));

  // 仅在登录页面（/login）时自动跳转
  if ((isConnected || phoneLogin) && location.pathname === '/login') {
    navigate('/');
  }

  const handleWalletConnect = () => {
    open(); // 触发 web3modal 的钱包选择弹框
  };

  const handlePhoneLogin = () => {
    const phone = prompt('请输入手机号码：');
    if (phone && /^\d{11}$/.test(phone)) {
      localStorage.setItem('phoneLogin', phone);
      setPhoneLogin(phone);
      message.success('手机登录成功');
      navigate('/');
    } else {
      message.error('请输入有效的11位手机号码');
    }
  };

  return (
    <div style={{ padding: '40px', background: '#e6f7ff', textAlign: 'center' }}>
      <div
        style={{
          background: 'url("https://www.pngall.com/wp-content/uploads/2016/05/White-Paper-PNG-Clipart.png") no-repeat center',
          backgroundSize: 'contain',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
        }}
      >
        <Title style={{ fontSize: '36px', color: '#ff4d4f', fontWeight: 'bold', margin: 0 }}>
          欢迎来到彩蛋娱乐
        </Title>
      </div>
      <Text style={{ fontSize: '16px', color: '#666' }}>
        请连接钱包或使用手机号码登录以访问更多功能
      </Text>
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: '40px' }}>
        <Col span={12}>
          <Button
            type="default"
            block
            icon={<WalletOutlined />}
            style={{
              height: '50px',
              fontSize: '16px',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={handleWalletConnect}
          >
            连接钱包
            <WalletOutlined />
          </Button>
        </Col>
        <Col span={12}>
          <Button
            type="default"
            block
            icon={<MailOutlined />}
            style={{
              height: '50px',
              fontSize: '16px',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={handlePhoneLogin}
          >
            邮箱登录
            <MailOutlined />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Login;