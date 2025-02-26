import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Typography, Card, Select, InputNumber, Space, List, Spin, message, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'; // 用于连接状态

const { Title, Text } = Typography;

interface LotteryType {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface LotteryPeriod {
  id: number;
  period: string;
  date: number; // 改为毫秒时间戳
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
  const [periods, setPeriods] = useState<LotteryPeriod[]>([]); // 改为状态变量
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  // Mock 数据：彩票类型
  const lotteryTypes: LotteryType[] = [
    { id: 1, name: '数字彩票', description: '基于数字预测的经典彩票', price: 0.1 },
    { id: 2, name: '幸运转盘彩票', description: '随机转盘抽奖，每 5 分钟一期，快速出奖！', price: 0.15 },
    { id: 3, name: 'NFT 彩票', description: '限时活动专属 NFT 彩票', price: 0.2 },
  ];

  // 生成动态期号（每 5 分钟一期）
  const generatePeriods = (): LotteryPeriod[] => {
    const now = new Date();
    const periods: LotteryPeriod[] = [];
    for (let i = 0; i < 3; i++) {
      const nextPeriod = new Date(now.getTime() + i * 5 * 60 * 1000); // 每 5 分钟一期
      periods.push({
        id: i + 1,
        period: `当前期 (第${i + 1}期)`,
        date: nextPeriod.getTime(), // 直接使用毫秒时间戳
      });
    }
    return periods;
  };

  // 初始设置 periods
  useEffect(() => {
    setPeriods(generatePeriods());
  }, []);

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
    if (lotteryType === '幸运转盘彩票' && period) {
      setLotterySelection({ type: '幸运转盘彩票', period });
    }
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
    const randomNumbers: number[] = [];
    while (randomNumbers.length < 6) {
      const num = Math.floor(Math.random() * 50) + 1;
      if (!randomNumbers.includes(num)) {
        randomNumbers.push(num);
      }
    }
    setLotterySelection({ type: '数字彩票', period: selectedPeriod!, numbers: randomNumbers.sort((a, b) => a - b) });
  };

  const handleNFTBuy = () => {
    if (lotteryType !== 'NFT 彩票' || !selectedPeriod) return;
    const nftId = Math.floor(Math.random() * 1000) + 1; // 模拟 NFT ID
    setLotterySelection({ type: 'NFT 彩票', period: selectedPeriod, nftId });
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
    if (lotteryType === '数字彩票' && (!lotterySelection || !lotterySelection.numbers || lotterySelection.numbers.length !== 6)) {
      message.error('请先选择 6 个号码！');
      return;
    }
    if (lotteryType === 'NFT 彩票' && !lotterySelection) {
      message.error('请先购买 NFT 彩票！');
      return;
    }

    // 模拟支付逻辑（仅 USDT）
    message.info('支付处理中...');
    await new Promise((resolve) => setTimeout(resolve, 500)); // 缩短支付延迟至 0.5 秒
    if (lotteryType === '幸运转盘彩票') {
      setIsSpinning(true);
      drawWheel(); // 开始绘制转盘动画
      // 模拟旋转 1 秒后停止
      const spinDuration = 1000;
      const randomAngle = Math.floor(Math.random() * 360); // 随机角度
      let angle = 0;
      const spinStep = 20; // 加快旋转速率，每帧旋转 20 度
      const interval = setInterval(() => {
        angle += spinStep;
        if (angle >= randomAngle + 1080) { // 旋转 3 圈（1080°）后再停止
          clearInterval(interval);
          const resultIndex = Math.floor((randomAngle % 360) / 72); // 每 72° 一个扇形
          const result = spinResults[resultIndex % spinResults.length];
          setSpinResult(result);
          setLotterySelection((prev) => ({
            type: '幸运转盘彩票',
            period: selectedPeriod!,
            spinResult: result,
          }));
          setIsSpinning(false);
          drawWheel(true, result); // 绘制停止后的转盘
          completePayment(result); // 支付完成后处理 NFT
        } else {
          drawWheel(false); // 持续旋转
        }
      }, 16); // 约 60 FPS
    } else {
      completePayment(null); // 数字彩票和 NFT 彩票直接支付
    }
  };

  const completePayment = (spinResult: string | null) => {
    const nftCertificate = {
      id: Math.floor(Math.random() * 1000) + 1,
      lotteryType: lotteryType,
      numbers: lotteryType === '数字彩票' ? lotterySelection?.numbers : undefined,
      purchaseTime: new Date().toLocaleString(),
      status: '有效',
      transactionHash: `0x${Math.random().toString(16).substr(2, 10)}`,
      spinResult: lotteryType === '幸运转盘彩票' ? spinResult : undefined,
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
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={300} 
              style={{ borderRadius: '50%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', marginTop: '16px' }}
            />
            {spinResult && (
              <Text strong style={{ marginTop: '16px', color: '#333333', fontSize: '18px' }}>
                转盘结果：{spinResult}
              </Text>
            )}
            <Text style={{ color: '#666666', marginTop: '8px' }}>每 5 分钟一期，快速出奖！</Text>
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
    if (!selectedPeriod) return null; // 仅需期号即可显示按钮
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
            彩票类型：{lotteryType}
          </Text>
          <Text style={{ color: '#666666', fontSize: '14px' }}>
            期号：{selectedPeriod.period}
          </Text>
          <Text style={{ color: '#666666', fontSize: '14px' }}>
            倒计时：{getCountdown(selectedPeriod.date.toString())}
          </Text>
          {lotteryType === '数字彩票' && lotterySelection?.numbers && (
            <Text style={{ color: '#666666', fontSize: '14px' }}>
              号码：{lotterySelection.numbers.join(', ')}
            </Text>
          )}
          {lotteryType === '幸运转盘彩票' && spinResult && (
            <Text style={{ color: '#666666', fontSize: '14px' }}>
              转盘结果：{spinResult}
            </Text>
          )}
          {lotteryType === 'NFT 彩票' && lotterySelection?.nftId && (
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

  // 绘制转盘函数
  const drawWheel = (stopped: boolean = false, result: string | null = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 140;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制转盘
    const sectors = spinResults.length;
    for (let i = 0; i < sectors; i++) {
      const angle = (2 * Math.PI / sectors) * i;
      const nextAngle = (2 * Math.PI / sectors) * (i + 1);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, nextAngle);
      ctx.fillStyle = `hsl(${i * (360 / sectors)}, 70%, 50%)`; // 渐变色
      ctx.fill();
      ctx.closePath();

      // 绘制文字
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + Math.PI / sectors);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(spinResults[i], radius - 20, 10);
      ctx.restore();
    }

    // 绘制指针
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX - 10, centerY - radius + 10);
    ctx.lineTo(centerX + 10, centerY - radius + 10);
    ctx.fillStyle = '#ff4d4f';
    ctx.fill();
    ctx.closePath();

    // 如果停止，绘制结果
    if (stopped && result) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(result, centerX, centerY + 20);
    }

    // 旋转动画
    if (isSpinning && !stopped) {
      ctx.rotate((Math.PI / 180) * 20); // 加快旋转速率，每帧旋转 20 度
      requestAnimationFrame(() => drawWheel());
    }
  };

  // 计算倒计时
  const getCountdown = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return '已开奖';

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // 简化格式为 MM:SS
  };

  useEffect(() => {
    if (lotteryType === '幸运转盘彩票' && canvasRef.current) {
      drawWheel(); // 初始绘制转盘
    }

    // 每秒更新倒计时和期号
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
  }, [lotteryType, selectedPeriod]);

  return (
    <div>
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
              style={{ width: '100%', marginBottom: '16px' }}
              disabled={!lotteryType}
            >
              {periods.map((period) => (
                <Select.Option key={period.id} value={period.id}>
                  {period.period} ({new Date(period.date).toLocaleTimeString()})
                </Select.Option>
              ))}
            </Select>
            {selectedPeriod && (
              <Statistic.Countdown
                title="开奖倒计时"
                value={new Date(selectedPeriod.date).getTime()}
                format="mm:ss"
                valueStyle={{ color: '#d4a017' }} // 金色强调倒计时
              />
            )}
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