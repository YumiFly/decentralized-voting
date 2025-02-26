import React, { useState, useEffect, useCallback } from 'react';
import { Button, Row, Col, Typography, Card, Space, Statistic, Grid, message } from 'antd';
import { SmileOutlined, SyncOutlined, GiftOutlined, NumberOutlined } from '@ant-design/icons'; // 使用 Ant Design 图标
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'; // 用于连接状态
import Particles from 'react-tsparticles'; // 使用 react-tsparticles
import { loadFull } from 'tsparticles'; // 使用 @tsparticles/engine
import type { Engine } from '@tsparticles/engine'; // 确保导入 @tsparticles/engine 类型

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// 自定义图标（模拟，使用 Ant Design 图标或 SVG）
const CustomIcon = ({ type }: { type: string }) => {
  const icons = {
    '数字彩票': <NumberOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
    '快乐彩': <SmileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
    '幸运转盘彩票': <SyncOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
    '彩蛋彩票': <GiftOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
  };
  return icons[type as keyof typeof icons] || null;
};

interface LotteryType {
  id: number;
  name: string;
  description: string;
  nextDrawTime: string; // 下一期开奖时间
  recentResult?: number[]; // 最近开奖结果（数字或奖项）
  prize?: string; // 奖励描述（如转盘奖励、彩蛋进度）
}

const Home: React.FC = () => {
  const [jackpot, setJackpot] = useState<number>(10000); // 模拟奖池金额（USDT）
  const [lotteryTypes, setLotteryTypes] = useState<LotteryType[]>([
    { id: 1, name: '数字彩票', description: '基于数字预测的经典彩票', nextDrawTime: '2025-03-01 14:00' },
    { id: 2, name: '快乐彩', description: '快速数字彩票，随时开奖', nextDrawTime: '2025-03-01 13:55', recentResult: [1, 5, 12, 23, 38, 45] },
    { id: 3, name: '幸运转盘彩票', description: '随机转盘抽奖，每 5 分钟一期', nextDrawTime: '2025-03-01 14:05', prize: '一等奖: 1000 USDT' },
    { id: 4, name: '彩蛋彩票', description: '限时活动彩蛋，神秘奖励', nextDrawTime: '2025-03-01 14:10', prize: '进度: 80%（剩余 2 个彩蛋）' },
  ]);
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const screens = useBreakpoint();

  // 模拟奖池每 5 秒随机增加
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => prev + Math.floor(Math.random() * 100)); // 随机增加 0-99 USDT
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 计算倒计时
  const getCountdown = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return '已开奖';

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // 格式为 MM:SS
  };

  const handleLotteryClick = (type: string) => {
    if (!isConnected) {
      message.warning('请先连接钱包！');
      navigate('/login');
      return;
    }
    navigate('/lottery', { state: { lotteryType: type } }); // 传递彩票类型到购买页面
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine); // Initialize tsparticles with @tsparticles/engine
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 背景粒子动画 - 使用 ts-particles */}
      <Particles
        id="tsparticles"
  
        options={{
          particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: '#1890ff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: false },
            move: { enable: true, speed: 2, direction: 'none', random: true, straight: false },
          },
          interactivity: { 
            detect_on: 'canvas', 
            events: { 
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
            } 
          },
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />

      {/* 内容区域 */}
      <div style={{ padding: '40px', position: 'relative', zIndex: 1 }}>
        {/* 顶部 banner */}
        <div style={{ 
          background: 'linear-gradient(45deg,rgb(240, 245, 248),rgb(231, 238, 243))', 
          borderRadius: '20px', 
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)', 
          padding: '32px', 
          marginBottom: '40px', 
          color: '#ffffff', 
          transition: 'transform 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(225, 215, 215, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
        }}>
          <Row gutter={24} justify="center" align="middle">
            <Col xs={12} sm={8} md={8} lg={8}>
              <Statistic 
                title={<Text style={{ color: '#000000', fontSize: '16px' }}>奖池金额</Text>} 
                value={jackpot} 
                precision={2} 
                suffix=" USDT" 
                valueStyle={{ color: '#d4a017', fontSize: '24px', fontWeight: 'bold' }} // 金色强调
              />
            </Col>
            <Col xs={12} sm={8} md={8} lg={8}>
              <Statistic 
                title={<Text style={{ color: '#000000', fontSize: '16px' }}>即将开奖</Text>} 
                value={getCountdown(lotteryTypes[2].nextDrawTime)} // 幸运转盘彩票的倒计时
                valueStyle={{ color: '#d4a017', fontSize: '24px', fontWeight: 'bold' }} // 金色强调
              />
            </Col>
            <Col xs={24} sm={8} md={8} lg={8}>
              <Text style={{ color: '#000000', fontSize: '14px' }}>立即参与，赢取大奖！</Text>
              <div style={{ 
                background: 'linear-gradient(45deg, #d4a017, #ffd700)', 
                borderRadius: '8px', 
                padding: '8px 16px', 
                marginTop: '8px', 
                animation: 'pulse 2s infinite',
              }}>
                <Text style={{ color: '#ffffff', fontSize: '16px' }}>奖品闪光</Text>
              </div>
            </Col>
          </Row>
        </div>

        {/* 彩票选择区 - 网格布局 */}
        <Row gutter={[24, 24]} justify="center">
          {lotteryTypes.map((lottery) => (
            <Col 
              key={lottery.id} 
              xs={24} 
              sm={12} 
              md={12} 
              lg={6} 
              style={{ marginBottom: '24px' }}
            >
              <Card 
                hoverable 
                bordered={false} 
                style={{ 
                  borderRadius: '20px', 
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)', 
                  background: 'linear-gradient(135deg, #ffffff, #f0f8ff)', 
                  padding: '24px', 
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s, background 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #e6f7ff)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #f0f8ff)';
                }}
              >
                {/* 图标装饰 */}
                <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  left: '20px', 
                  background: 'linear-gradient(45deg, #d4a017, #ffd700)', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  animation: 'bounce 2s infinite',
                }}>
                  <CustomIcon type={lottery.name} />
                </div>
                <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '20px' }}>
                  <Text strong style={{ color: '#333333', fontSize: '24px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }}>{lottery.name}</Text>
                  <Text style={{ color: '#666666', fontSize: '16px' }}>{lottery.description}</Text>
                  {lottery.nextDrawTime && (
                    <Text style={{ color: '#666666', fontSize: '16px' }}>
                      下一期时间：{lottery.nextDrawTime}（倒计时：{getCountdown(lottery.nextDrawTime)})
                    </Text>
                  )}
                  {lottery.recentResult && (
                    <Text style={{ color: '#666666', fontSize: '16px' }}>
                      最近开奖：{lottery.recentResult.join(', ')}
                    </Text>
                  )}
                  {lottery.prize && (
                    <Text style={{ color: '#666666', fontSize: '16px' }}>
                      奖励：{lottery.prize}
                    </Text>
                  )}
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => handleLotteryClick(lottery.name)}
                    style={{ 
                      width: '100%', 
                      background: 'linear-gradient(45deg, #1890ff, #40a9ff)', 
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      padding: '16px 32px',
                      transition: 'background 0.3s, transform 0.3s, box-shadow 0.3s',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #40a9ff, #1890ff)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #1890ff, #40a9ff)';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    立即参与，赢取大奖！
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 奖池与奖品展示区 - 底部卡片 */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Card 
            title={<Text strong style={{ color: '#333333', fontSize: '24px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }}>奖池与奖品</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '20px', 
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)', 
              background: 'linear-gradient(135deg, #ffffff, #f0f8ff)', 
              padding: '32px', 
              maxWidth: '900px', 
              margin: '0 auto',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.1)';
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Statistic 
                title={<Text style={{ color: '#333333', fontSize: '18px' }}>奖池金额</Text>} 
                value={jackpot} 
                precision={2} 
                suffix=" USDT" 
                valueStyle={{ color: '#d4a017', fontSize: '32px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }} // 金色强调
              />
              <Text style={{ color: '#666666', fontSize: '16px' }}>
                奖池详情：70% 一等奖，20% 二等奖，10% 三等奖
              </Text>
              <Text style={{ color: '#666666', fontSize: '16px' }}>
                剩余奖品：<span style={{ color: '#d4a017' }}>5 个一等奖，10 个二等奖</span>
              </Text>
              <div style={{ 
                background: 'linear-gradient(45deg, #d4a017, #ffd700)', 
                borderRadius: '8px', 
                padding: '12px 24px', 
                animation: 'pulse 2s infinite',
              }}>
                <Text style={{ color: '#ffffff', fontSize: '18px' }}>立即参与，赢取巨额奖励！</Text>
              </div>
            </Space>
          </Card>
        </div>
      </div>

      {/* CSS 动画 */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;