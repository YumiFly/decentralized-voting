import React from 'react';
import { Button, Typography } from 'antd';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  if (isConnected) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#333', // 黑色背景，与你的截图一致
      color: '#fff', // 白色文字
    }}>
      <Title level={1} style={{ marginBottom: '40px', color: '#fff' }}>
        去中心化投票系统
      </Title>
      <Button
        type="primary"
        size="large"
        onClick={() => open()}
        style={{ 
          padding: '16px 32px', 
          fontSize: '18px', 
          borderRadius: '8px',
          backgroundColor: '#1890ff',
          borderColor: '#1890ff',
        }}
      >
        连接钱包
      </Button>
    </div>
  );
};

export default Login;