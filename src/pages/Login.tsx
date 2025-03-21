import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect, useWriteContract } from 'wagmi';
import { Row, Col, Typography, Button, Form, Input, message, Spin } from 'antd';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { WalletOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// 假设智能合约 ABI 和地址
const contractABI = [
  {
    name: 'register',
    type: 'function',
    inputs: [{ name: 'userAddress', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'isRegistered',
    type: 'function',
    inputs: [{ name: 'userAddress', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
] as const;

const contractAddress = '0xYourContractAddress' as `0x${string}`; // 替换为实际合约地址

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [kycForm] = Form.useForm();

  // 使用 useWriteContract
  const { data: hash, error: writeError, isPending: writePending, writeContract } = useWriteContract();

  // 检查用户是否已注册（模拟链上查询）
  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      // 模拟调用智能合约的 isRegistered 方法
      // 实际需使用 useContractRead 或其他方法调用
      const checkRegistration = async () => {
        try {
          // 假设通过链上查询
          const response = await fetch(`/api/check-registration?address=${address}`);
          const data = await response.json();
          setIsRegistered(data.isRegistered);
        } catch (error) {
          message.error('检查注册状态失败！');
          setIsRegistered(false);
        } finally {
          setLoading(false);
        }
      };
      checkRegistration();
    }
  }, [isConnected, address]);

  // 连接钱包
  const handleConnectWallet = () => {
    if (!isConnected) {
      open(); // 使用 web3modal 打开钱包选择弹框
    } else {
      disconnect();
    }
  };

  // 提交 KYC 数据
  const handleKycSubmit = async (values: any) => {
    if (!isConnected || !address) {
      message.warning('请先连接钱包！');
      return;
    }

    setLoading(true);
    try {
      // 链下存储 KYC 数据
      const kycData = {
        address,
        name: values.name,
        idNumber: values.idNumber,
        timestamp: new Date().toISOString(),
      };
      const kycResponse = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kycData),
      });
      if (!kycResponse.ok) throw new Error('KYC 数据存储失败');

      // 链上调用 register()
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'register',
        args: [address],
      });

      // 等待交易确认（writeContract 内部会处理）
      message.success('注册成功！');
      navigate('/');
    } catch (error) {
      message.error('注册失败：' + (error as Error).message);
    } finally {
      setLoading(false);
      kycForm.resetFields();
    }
  };

  // 已注册用户直接登录
  const handleLogin = () => {
    message.success('登录成功！');
    navigate('/');
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
      <Text style={{ fontSize: '16px', color: '#666' }}>
        请连接钱包以访问更多功能
      </Text>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: '16px', color: '#333' }}>正在检查注册状态...</Text>
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: '40px' }}>
          {!isConnected ? (
            <Col span={12}>
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
              <Text type="warning" style={{ marginTop: '16px', display: 'block', textAlign: 'center', color: '#ff4d4f' }}>
                请连接钱包以继续
              </Text>
            </Col>
          ) : isRegistered === true ? (
            <Col span={12}>
              <Text style={{ display: 'block', marginBottom: '16px', color: '#333', fontSize: '16px' }}>
                钱包地址：{address?.slice(0, 6)}...{address?.slice(-4)}
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
                onClick={handleLogin}
              >
                登录
                <WalletOutlined />
              </Button>
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
                  marginTop: '16px',
                }}
                onClick={handleConnectWallet}
              >
                断开钱包
                <WalletOutlined />
              </Button>
            </Col>
          ) : (
            <Col span={12}>
              <Form form={kycForm} onFinish={handleKycSubmit} layout="vertical">
                <Form.Item
                  name="name"
                  label={<Text strong style={{ color: '#333' }}>姓名</Text>}
                  rules={[{ required: true, message: '请输入您的姓名！' }]}
                >
                  <Input placeholder="请输入您的姓名" />
                </Form.Item>
                <Form.Item
                  name="idNumber"
                  label={<Text strong style={{ color: '#333' }}>身份证号</Text>}
                  rules={[{ required: true, message: '请输入您的身份证号！' }]}
                >
                  <Input placeholder="请输入您的身份证号" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading || writePending}
                    block
                    style={{
                      height: '50px',
                      fontSize: '16px',
                      background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                      border: 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #ff7875, #ff4d4f)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #ff4d4f, #ff7875)')}
                  >
                    {writePending ? '发送中...' : '提交 KYC 数据'}
                  </Button>
                </Form.Item>
              </Form>
              {writeError && (
                <Text type="danger" style={{ display: 'block', marginBottom: '16px' }}>
                  错误: {writeError.message}
                </Text>
              )}
              {hash && (
                <Text style={{ display: 'block', marginBottom: '16px', color: '#333' }}>
                  交易哈希: {hash}
                </Text>
              )}
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
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default Login;