import React, { useState } from 'react';
import { Button, Row, Col, Typography, Card, Statistic, Form, Input, List, Space, Modal, message,InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount, useBalance, useDisconnect } from 'wagmi'; // 用于账户信息、余额和断开连接

const { Title, Text } = Typography;

interface Prize {
  id: number;
  amount: number; // ETH
  time: string;
}

interface NFTCertificate {
  id: number;
  lotteryType: string;
  numbers: number[];
  purchaseTime: string;
  status: '有效' | '已使用';
  transactionHash?: string; // 模拟交易哈希
}

const Wallet: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address }); // 获取账户余额
  const [prizes, setPrizes] = useState<Prize[]>([
    { id: 1, amount: 5000, time: '2025-02-25 14:00' },
    { id: 2, amount: 1000, time: '2025-02-24 12:00' },
  ]);
  const [nftCertificates, setNftCertificates] = useState<NFTCertificate[]>([
    { id: 1, lotteryType: '幸运数字彩票', numbers: [1, 5, 12, 23, 38, 45], purchaseTime: '2025-02-25 10:00', status: '有效', transactionHash: '0x123...456' },
    { id: 2, lotteryType: '抽奖型彩票', numbers: [3, 15, 22, 34, 40, 49], purchaseTime: '2025-02-24 09:30', status: '已使用', transactionHash: '0x789...ABC' },
  ]);
  const [form] = Form.useForm();
  const [selectedNFT, setSelectedNFT] = useState<NFTCertificate | null>(null);
  const navigate = useNavigate();

  const totalPrize = prizes.reduce((sum, prize) => sum + prize.amount, 0); // 未提取奖金总额
  const ethBalance = balance ? Number(balance.formatted) : 0; // 账户余额（ETH）

  const handleWithdraw = (values: any) => {
    if (!isConnected) {
      message.warning('请先连接钱包！');
      navigate('/login');
      return;
    }
    const amount = Number(values.amount);
    if (amount > totalPrize || amount <= 0) {
      message.error('提现金额无效！');
      return;
    }
    // 模拟提现逻辑
    setPrizes(prizes.filter((p) => p.amount !== amount)); // 移除已提现的奖金
    message.success(`成功提现 ${amount} ETH 到 ${values.address}！`);
    form.resetFields();
  };

  const handleLogout = () => {
    if (!isConnected) {
      message.warning('未连接钱包，无需退出！');
      return;
    }
    disconnect();
    message.success('已退出登录！');
    navigate('/login'); // 跳转到登录页面
  };

  const handleBackToHome = () => {
    navigate('/'); // 返回首页
  };

  const showNFTDetail = (nft: NFTCertificate) => {
    setSelectedNFT(nft);
  };

  const handleNFTCancel = () => {
    setSelectedNFT(null);
  };

  return (
    <div>
      {/* <Title level={1} style={{ textAlign: 'center', color: '#333333', marginBottom: '40px' }}>
        钱包
      </Title> */}
      <Row gutter={32}>
        <Col span={6}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>账户余额</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
              backgroundColor: '#ffffff', 
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Statistic 
              title="余额" 
              value={ethBalance} 
              precision={4} 
              suffix=" ETH" 
              valueStyle={{ color: '#d4a017' }} // 金色强调余额
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>未提取奖金</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
              backgroundColor: '#ffffff', 
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Statistic 
              title="总计" 
              value={totalPrize} 
              precision={2} 
              suffix=" ETH" 
              valueStyle={{ color: '#d4a017' }} // 金色强调奖金
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>奖金明细</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
              backgroundColor: '#ffffff', 
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <List
              dataSource={prizes}
              renderItem={(prize) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="horizontal" size="small">
                    <Text style={{ color: '#666666', fontSize: '14px' }}>{prize.time}</Text>
                    <Text strong style={{ color: '#d4a017', fontSize: '16px' }}>{prize.amount} ETH</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>NFT 凭证</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
              backgroundColor: '#ffffff', 
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <List
              dataSource={nftCertificates}
              renderItem={(nft) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="horizontal" size="small">
                    <Text style={{ color: '#333333', fontSize: '16px' }}>ID: {nft.id}</Text>
                    <Text strong style={{ color: '#333333', fontSize: '16px' }}>{nft.lotteryType}</Text>
                    <Button 
                      type="link" 
                      onClick={() => showNFTDetail(nft)}
                      style={{ padding: 0, color: '#1890ff', fontSize: '14px' }}
                    >
                      查看详情
                    </Button>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={32} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>提现</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
              backgroundColor: '#ffffff', 
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Form form={form} onFinish={handleWithdraw} layout="vertical">
              <Form.Item name="amount" label="提现金额（ETH）" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入金额" />
              </Form.Item>
              <Form.Item name="address" label="接收地址" rules={[{ required: true }]}>
                <Input placeholder="请输入以太坊地址（如 0x...）" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  提交提现
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        {/* <Button 
          onClick={handleBackToHome} 
          style={{ 
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            borderColor: '#d9d9d9',
            color: '#333333',
            padding: '8px 24px',
            fontSize: '16px',
            transition: 'border-color 0.3s, background-color 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
            e.currentTarget.style.borderColor = '#666666';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#d9d9d9';
          }}
        >
          返回首页
        </Button>
        <Button 
          onClick={handleLogout} 
          style={{ 
            marginLeft: '16px',
            borderRadius: '8px',
            background: 'linear-gradient(45deg, #ff4d4f, #ff7875)', // 红色渐变，突出退出
            border: 'none',
            color: '#ffffff',
            padding: '8px 24px',
            fontSize: '16px',
            transition: 'background 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #ff7875, #ff4d4f)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #ff4d4f, #ff7875)'}
        >
          退出登录
        </Button> */}
        {!isConnected && (
          <Text type="warning" style={{ marginTop: '16px', display: 'block', textAlign: 'center', color: '#ff4d4f' }}>
            操作前请确保连接钱包
          </Text>
        )}
      </div>

      {/* NFT 凭证详情模态框 */}
      <Modal
        title={<Text strong style={{ color: '#ffffff' }}>NFT 凭证详情</Text>}
        open={!!selectedNFT}
        onCancel={handleNFTCancel}
        footer={null}
        width={600}
        style={{ 
          borderRadius: '16px', // 更大圆角，现代感
          background: 'linear-gradient(135deg, #e6f7ff, #ffffff)', // 浅蓝色渐变背景
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', // 更深的阴影，突出
        }}
      >
        {selectedNFT && (
          <div style={{ 
            padding: '24px', 
            background: '#ffffff', // 内部白色背景，与渐变形成对比
            borderRadius: '12px', 
            border: '2px solid #1890ff', // 蓝色边框，设计感
          }}>
            <Space direction="vertical"  style={{ width: '100%' }}>
              {/* 凭证标题和徽章 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px', 
                background: 'linear-gradient(45deg, #1890ff, #40a9ff)', // 蓝色渐变徽章
                borderRadius: '8px', 
                color: '#ffffff', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}>
                <Text strong style={{ fontSize: '24px' }}>凭证 #{selectedNFT.id}</Text>
                <Text style={{ fontSize: '16px', background: '#d4a017', padding: '4px 12px', borderRadius: '4px' }}>
                  {selectedNFT.status}
                </Text>
              </div>

              {/* 详细信息 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Text strong style={{ color: '#333333', fontSize: '18px' }}>
                  彩票类型：{selectedNFT.lotteryType}
                </Text>
                <Text style={{ color: '#666666', fontSize: '16px' }}>
                  选定号码：<span style={{ color: '#1890ff', fontWeight: 'bold' }}>{selectedNFT.numbers.join(', ')}</span>
                </Text>
                <Text style={{ color: '#666666', fontSize: '16px' }}>
                  购买时间：{selectedNFT.purchaseTime}
                </Text>
                {selectedNFT.transactionHash && (
                  <Text style={{ color: '#666666', fontSize: '16px' }}>
                    交易哈希：<span style={{ color: '#1890ff', fontWeight: 'bold' }}>{selectedNFT.transactionHash}</span>
                  </Text>
                )}
                <Text style={{ color: '#666666', fontSize: '16px' }}>
                  奖池信息：关联奖池 {jackpot} ETH（模拟数据）
                </Text>
              </div>

              {/* 分隔线 */}
              <div style={{ borderBottom: '2px dashed #1890ff', margin: '16px 0' }} />

              {/* 关闭按钮 */}
              <Button 
                onClick={handleNFTCancel} 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(45deg, #1890ff, #40a9ff)', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  padding: '12px 24px',
                  transition: 'background 0.3s, transform 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #40a9ff, #1890ff)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #1890ff, #40a9ff)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                关闭
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

const jackpot = 10000; // 初始值，可根据需要动态更新
export default Wallet;