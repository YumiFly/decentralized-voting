import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Typography, Card, Select, InputNumber, Space, List, Modal, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'; // 用于连接状态

const { Title, Text } = Typography;

interface LotteryPeriod {
  id: number;
  period: string;
  date: string;
}

interface LotterySelection {
  type: string;
  period: LotteryPeriod;
  numbers?: number[]; // 数字彩票
  spinResult?: string; // 幸运转盘结果
  nftId?: number; // NFT 彩票编号
}

const Lottery: React.FC = () => {
  const [lotteryType, setLotteryType] = useState<string>('数字彩票');
  const [selectedPeriod, setSelectedPeriod] = useState<LotteryPeriod | null>(null);
  const [lotterySelection, setLotterySelection] = useState<LotterySelection | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0.1); // 默认投注金额（USDT）
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  interface LotteryType {
    id: number;
    name: string;
    description: string;
    price: number;
  }

  // Mock 数据：彩票类型和期号
  const lotteryTypes: LotteryType[] = [
    { id: 1, name: '数字彩票', description: '基于数字预测的经典彩票', price: 0.1 },
    { id: 2, name: '幸运转盘彩票', description: '随机转盘抽奖，机会均等', price: 0.15 },
    { id: 3, name: 'NFT 彩票', description: '限时活动专属 NFT 彩票', price: 0.2 },
  ];
  const periods: LotteryPeriod[] = [
    { id: 1, period: '2025-03-01 第1期', date: '2025-03-01' },
    { id: 2, period: '2025-03-01 第2期', date: '2025-03-01' },
    { id: 3, period: '2025-03-08 第1期', date: '2025-03-08' },
  ];

  // 数字范围（1-50）
  const numberRange = Array.from({ length: 50 }, (_, i) => i + 1);

  // 幸运转盘结果（模拟）
  const spinResults = ['一等奖', '二等奖', '三等奖', '安慰奖', '未中奖'];

  const handleLotteryTypeChange = (value: string) => {
    setLotteryType(value);
    setLotterySelection(null); // 重置选择
    setSelectedPeriod(null);
    setSpinResult(null);
  };

  const handlePeriodChange = (value: number) => {
    const period = periods.find((p) => p.id === value) || null;
    setSelectedPeriod(period);
  };

  const handleNumberSelect = (number: number) => {
    if (lotteryType !== '数字彩票') return;
    setLotterySelection((prev) => {
      if (!prev || !prev.numbers) {
        return { type: '数字彩票', period: selectedPeriod!, numbers: [number] };
      }
      if (prev.numbers.includes(number)) {
        return { ...prev, numbers: prev.numbers.filter((n) => n !== number) };
      } else if (prev.numbers.length < 6) {
        return { ...prev, numbers: [...prev.numbers, number].sort((a, b) => a - b) };
      }
      return prev;
    });
  };

  const handleRandomGenerate = () => {
    if (lotteryType !== '数字彩票') return;
    const randomNumbers:number[] = [];
    while (randomNumbers.length < 6) {
      const num = Math.floor(Math.random() * 50) + 1;
      if (!randomNumbers.includes(num)) {
        randomNumbers.push(num);
      }
    }
    setLotterySelection({ type: '数字彩票', period: selectedPeriod!, numbers: randomNumbers.sort((a, b) => a - b) });
  };

  const handleSpin = async () => {
    if (lotteryType !== '幸运转盘彩票' || !selectedPeriod) return;
    setIsSpinning(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 模拟转盘旋转 2 秒
    const result = spinResults[Math.floor(Math.random() * spinResults.length)];
    setSpinResult(result);
    setLotterySelection({ type: '幸运转盘彩票', period: selectedPeriod, spinResult: result });
    setIsSpinning(false);
  };

  const handleNFTBuy = () => {
    if (lotteryType !== 'NFT 彩票' || !selectedPeriod) return;
    const nftId = Math.floor(Math.random() * 1000) + 1; // 模拟 NFT ID
    setLotterySelection({ type: 'NFT 彩票', period: selectedPeriod, nftId });
  };

  const handlePayment = () => {
    if (!isConnected) {
      message.warning('请先连接钱包！');
      navigate('/login');
      return;
    }
    if (!lotterySelection || !selectedPeriod) {
      message.error('请先选择彩票类型和期号！');
      return;
    }
    // 模拟支付逻辑（仅 USDT）
    const nftCertificate = {
      id: Math.floor(Math.random() * 1000) + 1,
      lotteryType: lotterySelection.type,
      numbers: lotterySelection.type === '数字彩票' ? lotterySelection.numbers : undefined,
      purchaseTime: new Date().toLocaleString(),
      status: '有效',
      transactionHash: `0x${Math.random().toString(16).substr(2, 10)}`,
    };
    message.success(`购买成功！生成 NFT 凭证 ID: ${nftCertificate.id}，支付金额: ${betAmount} USDT`);
    navigate('/wallet'); // 跳转到钱包查看 NFT
    // 模拟将 NFT 添加到钱包（实际项目中可通过状态管理或 API 实现）
    // setNftCertificates((prev) => [...prev, nftCertificate]);
  };

  const renderSelection = () => {
    switch (lotteryType) {
      case '数字彩票':
        return (
          <div>
            <Text>选择 6 个号码（1-50）：</Text>
            <Button 
              onClick={handleRandomGenerate} 
              style={{ marginLeft: '10px', background: '#d4a017', borderColor: '#d4a017', color: '#ffffff' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#c99a1d'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#d4a017'}
            >
              随机选号
            </Button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {numberRange.map((number) => (
                <Button
                  key={number}
                  type={lotterySelection?.numbers?.includes(number) ? 'primary' : 'default'}
                  onClick={() => handleNumberSelect(number)}
                  style={{ 
                    borderRadius: '50%', 
                    width: '40px', 
                    height: '40px',
                    background: lotterySelection?.numbers?.includes(number) ? '#1890ff' : '#ffffff',
                    borderColor: lotterySelection?.numbers?.includes(number) ? '#1890ff' : '#d9d9d9',
                    transition: 'background 0.3s, border-color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (!lotterySelection?.numbers?.includes(number)) {
                      e.currentTarget.style.background = '#e6f7ff';
                      e.currentTarget.style.borderColor = '#1890ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!lotterySelection?.numbers?.includes(number)) {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#d9d9d9';
                    }
                  }}
                >
                  {number}
                </Button>
              ))}
            </div>
            <Text strong style={{ marginTop: '16px', color: '#333333' }}>
              已选号码：{lotterySelection?.numbers?.length === 0 ? '无' : lotterySelection?.numbers?.join(', ')}
            </Text>
          </div>
        );
      case '幸运转盘彩票':
        return (
          <div style={{ textAlign: 'center' }}>
            <Text>点击开始旋转幸运转盘：</Text>
            <Button 
              onClick={handleSpin} 
              disabled={isSpinning} 
              style={{ 
                marginTop: '16px', 
                background: '#d4a017', 
                borderColor: '#d4a017', 
                color: '#ffffff',
                padding: '12px 24px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#c99a1d'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#d4a017'}
            >
              {isSpinning ? <Spin /> : '开始旋转'}
            </Button>
            {spinResult && (
              <Text strong style={{ marginTop: '16px', color: '#333333', fontSize: '18px' }}>
                转盘结果：{spinResult}
              </Text>
            )}
          </div>
        );
      case 'NFT 彩票':
        return (
          <div>
            <Text>购买后生成独特 NFT 彩票：</Text>
            <Button 
              onClick={handleNFTBuy} 
              style={{ 
                marginTop: '16px', 
                background: '#1890ff', 
                borderColor: '#1890ff', 
                color: '#ffffff',
                padding: '12px 24px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#40a9ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1890ff'}
            >
              购买 NFT 彩票
            </Button>
            {lotterySelection?.nftId && (
              <Text strong style={{ marginTop: '16px', color: '#333333', fontSize: '18px' }}>
                NFT 编号：{lotterySelection.nftId}
              </Text>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderConfirmation = () => {
    if (!lotterySelection || !selectedPeriod) return null;
    return (
      <Card 
        title={<Text strong style={{ color: '#333333' }}>确认购买</Text>} 
        bordered={false} 
        style={{ 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          backgroundColor: '#ffffff', 
          padding: '20px',
          marginTop: '20px',
          transition: 'transform 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Space direction="vertical" size="large">
          <Text strong style={{ color: '#333333', fontSize: '16px' }}>
            彩票类型：{lotterySelection.type}
          </Text>
          <Text style={{ color: '#666666', fontSize: '14px' }}>
            期号：{selectedPeriod.period}
          </Text>
          {lotterySelection.numbers && (
            <Text style={{ color: '#666666', fontSize: '14px' }}>
              号码：{lotterySelection.numbers.join(', ')}
            </Text>
          )}
          {lotterySelection.spinResult && (
            <Text style={{ color: '#666666', fontSize: '14px' }}>
              转盘结果：{lotterySelection.spinResult}
            </Text>
          )}
          {lotterySelection.nftId && (
            <Text style={{ color: '#666666', fontSize: '14px' }}>
              NFT 编号：{lotterySelection.nftId}
            </Text>
          )}
          <Text strong style={{ color: '#d4a017', fontSize: '18px' }}>
            投注金额：{betAmount} USDT
          </Text>
          <Button
            type="primary"
            size="large"
            onClick={handlePayment}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(45deg, #1890ff, #40a9ff)', 
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              padding: '12px 24px',
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #40a9ff, #1890ff)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #1890ff, #40a9ff)'}
          >
            立即支付
          </Button>
        </Space>
      </Card>
    );
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div>
      {/* <Title level={1} style={{ textAlign: 'center', color: '#333333', marginBottom: '40px' }}>
        彩票购买
      </Title> */}
      <Row gutter={32}>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>选择彩票类型与期号</Text>} 
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
            <Select
              placeholder="请选择彩票类型"
              onChange={handleLotteryTypeChange}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {lotteryTypes.map((lottery) => (
                <Select.Option key={lottery.id} value={lottery.name}>
                  {lottery.name} - {lottery.description}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="请选择期号"
              onChange={handlePeriodChange}
              style={{ width: '100%' }}
              disabled={!lotteryType}
            >
              {periods.map((period) => (
                <Select.Option key={period.id} value={period.id}>
                  {period.period} ({period.date})
                </Select.Option>
              ))}
            </Select>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>选号</Text>} 
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
            {renderSelection()}
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>投注与支付</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
              backgroundColor: '#ffffff', 
              padding: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div>
              <Text strong style={{ color: '#333333', marginBottom: '16px' }}>投注金额 (USDT)</Text>
              <InputNumber
                value={betAmount}
                onChange={(value) => setBetAmount(Number(value) || 0.1)}
                min={0.1}
                step={0.1}
                addonAfter="USDT"
                style={{ width: '100%', marginBottom: '16px' }}
              />
            </div>
            {renderConfirmation()}
            {/* <Button 
              onClick={handleBackToHome} 
              style={{ 
                width: '100%', 
                marginTop: '16px', 
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                borderColor: '#d9d9d9',
                color: '#333333',
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
            </Button> */}
            {!isConnected && (
              <Text type="warning" style={{ marginTop: '16px', display: 'block', textAlign: 'center', color: '#ff4d4f' }}>
                购买前请确保连接钱包
              </Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Lottery;