import React, { useState } from 'react';
import { Button, Row, Col, Typography, message } from 'antd';
import { useAccount, useDisconnect } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { WalletOutlined, MailOutlined } from '@ant-design/icons';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const navigate = useNavigate();
  const [phoneLogin, setPhoneLogin] = useState<string | null>(localStorage.getItem('phoneLogin'));

  if (isConnected || phoneLogin) {
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
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <Title level={2}>Welcome to 彩蛋娱乐</Title>
      <Text style={{ fontSize: '16px', color: '#666' }}>
        请连接钱包或使用手机号码登录以访问更多功能
      </Text>
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: '40px' }}>
        <Col span={24}>
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
            Connect Wallet
            <WalletOutlined />
          </Button>
        </Col>
        <Col span={24}>
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
            Email Login
            <MailOutlined />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Login;