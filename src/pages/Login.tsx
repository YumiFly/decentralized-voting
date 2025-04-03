import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { Row, Col, Typography, Button, message, Spin } from 'antd';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { WalletOutlined } from '@ant-design/icons';
import { login, LoginResponse } from '../api/auth'; // 引入登录 API

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [loading, setLoading] = useState(false);

  // 检查用户是否已注册并尝试登录
  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      const checkAndLogin = async () => {
        try {
          const response: LoginResponse = await login(address);
          if (response.code === 200) {
            localStorage.setItem('token', response.data.token); // 存储 token
            message.success('登录成功！');
            navigate('/');
          } else {
            navigate('/register'); // 未注册用户跳转到注册页面
          }
        } catch (error) {
          message.error('登录失败，请稍后重试！');
          navigate('/register'); // 登录失败也跳转到注册页面
        } finally {
          setLoading(false);
        }
      };
      checkAndLogin();
    }
  }, [isConnected, address, navigate]);

  // 连接或断开钱包
  const handleConnectWallet = () => {
    if (!isConnected) {
      open(); // 打开钱包选择弹框
    } else {
      disconnect();
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
          Welcome to 彩蛋娱乐
        </Title>
      </div>
      <Text style={{ fontSize: '16px', color: '#666' }}>请连接钱包以访问更多功能</Text>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: '16px', color: '#333' }}>正在登录...</Text>
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: '40px' }}>
          <Col span={12}>
            {isConnected && address ? (
              <>
                <Text style={{ display: 'block', marginBottom: '16px', color: '#333', fontSize: '16px' }}>
                  钱包地址：{address.slice(0, 6)}...{address.slice(-4)}
                </Text>
                <Button
                  block
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
                  onClick={handleConnectWallet}
                >
                  断开钱包
                  <WalletOutlined />
                </Button>
              </>
            ) : (
              <>
                <Button
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
                  onClick={handleConnectWallet}
                >
                  连接钱包
                  <WalletOutlined />
                </Button>
                <Text
                  type="warning"
                  style={{ marginTop: '16px', display: 'block', textAlign: 'center', color: '#ff4d4f' }}
                >
                  请连接钱包以继续
                </Text>
              </>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Login;