import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Typography, Card, Select, InputNumber, Space, Statistic, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';

const { Title, Text } = Typography;

interface LotteryType {
  id: number;
  name: string;
  description: string;
  price: number;
  maxNumbers: number;
  numberRange: [number, number];
  blueBallRange?: [number, number];
}

interface LotteryPeriod {
  id: number;
  period: string;
  date: number; // 毫秒时间戳
}

interface LotterySelection {
  type: string;
  period: LotteryPeriod;
  redNumbers?: number[];
  blueNumber?: number;
  multiple?: number;
}

const lotteryTypes: LotteryType[] = [
  {
    id: 1,
    name: '双色球',
    description: '6个红色球 (1-33) + 1个蓝色球 (1-16)，每注2元',
    price: 2,
    maxNumbers: 6,
    numberRange: [1, 33],
    blueBallRange: [1, 16],
  },
  {
    id: 2,
    name: '七乐彩',
    description: '7个号码 (1-30)，每注2元，支持单式/复式/胆拖/多倍',
    price: 2,
    maxNumbers: 7,
    numberRange: [1, 30],
  },
  {
    id: 3,
    name: '3D',
    description: '3个号码 (000-999)，每注2元，支持1-99倍投注',
    price: 2,
    maxNumbers: 3,
    numberRange: [0, 9], // 每个位置 0-9
  },
];

const lotteryRouteMap: Record<string, string> = {
  shuangseqiu: '双色球',
  qilecai: '七乐彩',
  '3d': '3D',
};

const Lottery: React.FC = () => {
  const { lotteryRoute } = useParams<{ lotteryRoute: string }>();
  const initialLotteryType = lotteryRoute ? lotteryRouteMap[lotteryRoute] || '双色球' : '双色球';
  const [lotteryType, setLotteryType] = useState<string>(initialLotteryType);
  const [selectedPeriod, setSelectedPeriod] = useState<LotteryPeriod | null>(null);
  const [lotterySelection, setLotterySelection] = useState<LotterySelection | null>(null);
  const [betAmount, setBetAmount] = useState<number>(2);
  const [multiple, setMultiple] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  // 生成动态期号
  const generatePeriods = (): LotteryPeriod[] => {
    const now = new Date();
    const periods: LotteryPeriod[] = [];
    const days = lotteryType === '七乐彩' ? [2, 4, 7] : lotteryType === '3D' ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6];
    for (let i = 0; i < 3; i++) {
      const nextDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      if (lotteryType === '七乐彩' && !days.includes(nextDate.getDay())) continue;
      periods.push({
        id: i + 1,
        period: `第${new Date().getFullYear()}${String(i + 1).padStart(3, '0')}期`,
        date: nextDate.getTime(),
      });
    }
    return periods;
  };

  useEffect(() => {
    setPeriods(generatePeriods());
  }, [lotteryType]);

  const [periods, setPeriods] = useState<LotteryPeriod[]>([]);

  const handleLotteryTypeChange = (value: string) => {
    setLotteryType(value);
    setLotterySelection(null);
    setSelectedPeriod(null);
    setBetAmount(2);
    setMultiple(1);
  };

  const handlePeriodChange = (value: number) => {
    const period = periods.find((p) => p.id === value) || null;
    setSelectedPeriod(period);
  };

  const handleNumberSelect = (number: number, isBlue?: boolean) => {
    const type = lotteryTypes.find(t => t.name === lotteryType);
    if (!type || !selectedPeriod) return;

    if (lotteryType === '3D') {
      setLotterySelection((prev) => {
        if (!prev) return { type: lotteryType, period: selectedPeriod, multiple: 1 };
        const numbers = prev.redNumbers || [];
        if (numbers.length < type.maxNumbers) {
          numbers.push(number);
          return { ...prev, redNumbers: numbers.slice(0, 3) };
        }
        return prev;
      });
    } else if (lotteryType === '双色球') {
      setLotterySelection((prev) => {
        if (!prev) return { type: lotteryType, period: selectedPeriod, multiple: 1 };
        if (isBlue) {
          return { ...prev, blueNumber: number };
        } else {
          const numbers = prev.redNumbers || [];
          if (numbers.length < type.maxNumbers) {
            if (!numbers.includes(number)) numbers.push(number);
            return { ...prev, redNumbers: numbers.sort((a, b) => a - b).slice(0, 6) };
          }
        }
        return prev;
      });
    } else if (lotteryType === '七乐彩') {
      setLotterySelection((prev) => {
        if (!prev) return { type: lotteryType, period: selectedPeriod, multiple: 1 };
        const numbers = prev.redNumbers || [];
        if (numbers.length < type.maxNumbers) {
          if (!numbers.includes(number)) numbers.push(number);
          return { ...prev, redNumbers: numbers.sort((a, b) => a - b).slice(0, 7) };
        }
        return prev;
      });
    }
  };

  const handleRandomGenerate = () => {
    const type = lotteryTypes.find(t => t.name === lotteryType);
    if (!type) return;

    if (lotteryType === '3D') {
      const numbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
      setLotterySelection({ type: lotteryType, period: selectedPeriod!, redNumbers: numbers, multiple: 1 });
    } else if (lotteryType === '双色球') {
      const redNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 33) + 1).sort((a, b) => a - b);
      const blueNumber = Math.floor(Math.random() * 16) + 1;
      setLotterySelection({ type: lotteryType, period: selectedPeriod!, redNumbers, blueNumber, multiple: 1 });
    } else if (lotteryType === '七乐彩') {
      const numbers = Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 1).sort((a, b) => a - b);
      setLotterySelection({ type: lotteryType, period: selectedPeriod!, redNumbers: numbers, multiple: 1 });
    }
  };

  const handleMultipleChange = (value: number | null) => {
    const type = lotteryTypes.find(t => t.name === lotteryType);
    if (!type) return;
    const newMultiple = value || 1;
    const maxMultiple = lotteryType === '3D' ? 99 : 1; // 3D 支持 1-99 倍
    const finalMultiple = Math.min(Math.max(1, newMultiple), maxMultiple);
    setMultiple(finalMultiple);
    setBetAmount(type.price * finalMultiple);
  };

  const handlePayment = async () => {
    if (!isConnected) {
      message.warning('请先连接钱包！');
      navigate('/login');
      return;
    }
    if (!selectedPeriod) {
      message.error('请先选择期号！');
      return;
    }
    const type = lotteryTypes.find(t => t.name === lotteryType);
    if (!type) return;

    if (lotteryType === '3D' && (!lotterySelection || !lotterySelection.redNumbers || lotterySelection.redNumbers.length !== 3)) {
      message.error('请选3个号码！');
      return;
    }
    if (lotteryType === '双色球' && (!lotterySelection || !lotterySelection.redNumbers || lotterySelection.redNumbers.length !== 6 || !lotterySelection.blueNumber)) {
      message.error('请选6个红色球和1个蓝色球！');
      return;
    }
    if (lotteryType === '七乐彩' && (!lotterySelection || !lotterySelection.redNumbers || lotterySelection.redNumbers.length !== 7)) {
      message.error('请选7个号码！');
      return;
    }
    if (betAmount > 20000) {
      message.error('单张彩票投注金额不得超过20000元！');
      return;
    }

    message.info('支付处理中...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    const nftCertificate = {
      id: Math.floor(Math.random() * 1000) + 1,
      lotteryType: lotteryType,
      numbers: lotterySelection?.redNumbers,
      blueNumber: lotterySelection?.blueNumber,
      multiple: lotterySelection?.multiple,
      purchaseTime: new Date().toLocaleString(),
      status: '有效',
      transactionHash: `0x${Math.random().toString(16).substr(2, 10)}`,
    };
    message.success(`购买成功！生成 NFT 凭证 ID: ${nftCertificate.id}, 支付金额: ${betAmount} USDT`);
    navigate('/wallet');
  };

  const renderSelection = () => {
    const type = lotteryTypes.find(t => t.name === lotteryType);
    if (!type) return null;

    if (lotteryType === '3D') {
      return (
        <div>
          <Text style={{ color: '#fff' }}>选择3个号码 (000-999)：</Text>
          <Button
            onClick={handleRandomGenerate}
            style={{ marginLeft: '10px', background: '#ffd700', borderColor: '#ffd700', color: '#fff', borderRadius: '8px' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ffaa00')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffd700')}
          >
            随机选号
          </Button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {Array.from({ length: 10 }, (_, i) => i).map((number) => (
              <Button
                key={number}
                type={lotterySelection?.redNumbers?.includes(number) ? 'primary' : 'default'}
                onClick={() => handleNumberSelect(number)}
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  background: lotterySelection?.redNumbers?.includes(number) ? '#ff4d4f' : '#fff',
                  borderColor: lotterySelection?.redNumbers?.includes(number) ? '#ff4d4f' : '#d9d9d9',
                  color: lotterySelection?.redNumbers?.includes(number) ? '#fff' : '#000',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!lotterySelection?.redNumbers?.includes(number)) {
                    e.currentTarget.style.background = '#e6f7ff';
                    e.currentTarget.style.borderColor = '#ff4d4f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!lotterySelection?.redNumbers?.includes(number)) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#d9d9d9';
                  }
                }}
              >
                {number}
              </Button>
            ))}
          </div>
          <Text strong style={{ marginTop: '16px', color: '#fff' }}>
            已选号码：{lotterySelection?.redNumbers?.join('') || '无'}
          </Text>
        </div>
      );
    } else if (lotteryType === '双色球') {
      return (
        <div>
          <Text style={{ color: '#fff' }}>选择6个红色球 (1-33) 和1个蓝色球 (1-16)：</Text>
          <Button
            onClick={handleRandomGenerate}
            style={{ marginLeft: '10px', background: '#ffd700', borderColor: '#ffd700', color: '#fff', borderRadius: '8px' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ffaa00')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffd700')}
          >
            随机选号
          </Button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {Array.from({ length: 33 }, (_, i) => i + 1).map((number) => (
              <Button
                key={number}
                type={lotterySelection?.redNumbers?.includes(number) ? 'primary' : 'default'}
                onClick={() => handleNumberSelect(number)}
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  background: lotterySelection?.redNumbers?.includes(number) ? '#ff4d4f' : '#fff',
                  borderColor: lotterySelection?.redNumbers?.includes(number) ? '#ff4d4f' : '#d9d9d9',
                  color: lotterySelection?.redNumbers?.includes(number) ? '#fff' : '#000',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!lotterySelection?.redNumbers?.includes(number)) {
                    e.currentTarget.style.background = '#e6f7ff';
                    e.currentTarget.style.borderColor = '#ff4d4f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!lotterySelection?.redNumbers?.includes(number)) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#d9d9d9';
                  }
                }}
              >
                {number}
              </Button>
            ))}
            {Array.from({ length: 16 }, (_, i) => i + 1).map((number) => (
              <Button
                key={`blue-${number}`}
                type={lotterySelection?.blueNumber === number ? 'primary' : 'default'}
                onClick={() => handleNumberSelect(number, true)}
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  background: lotterySelection?.blueNumber === number ? '#1890ff' : '#fff',
                  borderColor: lotterySelection?.blueNumber === number ? '#1890ff' : '#d9d9d9',
                  color: lotterySelection?.blueNumber === number ? '#fff' : '#000',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (lotterySelection?.blueNumber !== number) {
                    e.currentTarget.style.background = '#e6f7ff';
                    e.currentTarget.style.borderColor = '#1890ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (lotterySelection?.blueNumber !== number) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#d9d9d9';
                  }
                }}
              >
                {number}
              </Button>
            ))}
          </div>
          <Text strong style={{ marginTop: '16px', color: '#fff' }}>
            已选号码：{lotterySelection?.redNumbers?.join(', ') || '无'} + {lotterySelection?.blueNumber || '无'}
          </Text>
        </div>
      );
    } else if (lotteryType === '七乐彩') {
      return (
        <div>
          <Text style={{ color: '#fff' }}>选择7个号码 (1-30)：</Text>
          <Button
            onClick={handleRandomGenerate}
            style={{ marginLeft: '10px', background: '#ffd700', borderColor: '#ffd700', color: '#fff', borderRadius: '8px' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ffaa00')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffd700')}
          >
            随机选号
          </Button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((number) => (
              <Button
                key={number}
                type={lotterySelection?.redNumbers?.includes(number) ? 'primary' : 'default'}
                onClick={() => handleNumberSelect(number)}
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  background: lotterySelection?.redNumbers?.includes(number) ? '#fa8c16' : '#fff',
                  borderColor: lotterySelection?.redNumbers?.includes(number) ? '#fa8c16' : '#d9d9d9',
                  color: lotterySelection?.redNumbers?.includes(number) ? '#fff' : '#000',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!lotterySelection?.redNumbers?.includes(number)) {
                    e.currentTarget.style.background = '#e6f7ff';
                    e.currentTarget.style.borderColor = '#fa8c16';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!lotterySelection?.redNumbers?.includes(number)) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#d9d9d9';
                  }
                }}
              >
                {number}
              </Button>
            ))}
          </div>
          <Text strong style={{ marginTop: '16px', color: '#fff' }}>
            已选号码：{lotterySelection?.redNumbers?.join(', ') || '无'}
          </Text>
        </div>
      );
    }
    return null;
  };

  const renderConfirmation = () => {
    if (!selectedPeriod) return null;
    const type = lotteryTypes.find(t => t.name === lotteryType);
    if (!type || !lotterySelection) return null;

    return (
      <Card
        title={<Text strong style={{ color: '#fff' }}>确认购买</Text>}
        bordered={false}
        style={{
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '20px',
        }}
      >
        <Space direction="vertical" size="large">
          <Text strong style={{ color: '#fff', fontSize: '16px' }}>彩票类型：{lotteryType}</Text>
          <Text style={{ color: '#fff', fontSize: '14px' }}>期号：{selectedPeriod.period}</Text>
          <Text style={{ color: '#fff', fontSize: '14px' }}>
            倒计时：{getCountdown(selectedPeriod.date.toString())}
          </Text>
          {lotterySelection.redNumbers && (
            <Text style={{ color: '#fff', fontSize: '14px' }}>
              号码：{lotterySelection.redNumbers.join(', ')}
              {lotterySelection.blueNumber && ` + ${lotterySelection.blueNumber}`}
            </Text>
          )}
          {lotteryType === '3D' && lotterySelection.multiple && (
            <Text style={{ color: '#fff', fontSize: '14px' }}>倍数：{lotterySelection.multiple}倍</Text>
          )}
          <Text strong style={{ color: '#ff4d4f', fontSize: '18px' }}>
            投注金额：{betAmount} USDT
          </Text>
          <Button
            type="primary"
            size="large"
            onClick={handlePayment}
            style={{
              width: '100%',
              background: '#ff4d4f',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              padding: '12px 24px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ff7875')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ff4d4f')}
          >
            立即支付
          </Button>
        </Space>
      </Card>
    );
  };

  const getCountdown = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return '已开奖';

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedPeriod((prev) => {
        if (prev) {
          const newPeriods = generatePeriods();
          const updatedPeriod = newPeriods.find((p) => p.id === prev.id) || newPeriods[0];
          return { ...updatedPeriod, date: updatedPeriod.date };
        }
        return null;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lotteryType]);

  return (
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
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
          购买 {lotteryType}
        </Title>
      </div>

      <Row gutter={32}>
        <Col span={8}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>选择彩票类型与期号</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            <Select
              value={lotteryType}
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
              style={{ width: '100%', marginBottom: '16px' }}
              disabled={!lotteryType}
            >
              {periods.map((period) => (
                <Select.Option key={period.id} value={period.id}>
                  {period.period} ({new Date(period.date).toLocaleDateString()})
                </Select.Option>
              ))}
            </Select>
            {selectedPeriod && (
              <Statistic.Countdown
                title="开奖倒计时"
                value={new Date(selectedPeriod.date).getTime()}
                format="mm:ss"
                valueStyle={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold' }}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>选号</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            {renderSelection()}
            {lotteryType === '3D' && (
              <InputNumber
                min={1}
                max={99}
                value={multiple}
                onChange={handleMultipleChange}
                style={{ marginTop: '16px', width: '100%' }}
                addonAfter="倍"
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>投注与支付</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fa8c16, #fadb14)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Text strong style={{ color: '#fff', marginBottom: '16px' }}>投注金额 (USDT)</Text>
              <InputNumber
                value={betAmount}
                disabled
                style={{ width: '100%', marginBottom: '16px' }}
                addonAfter="USDT"
              />
            </div>
            {renderConfirmation()}
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