import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Typography, Card, Statistic, List, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'; // 可选，用于连接状态

const { Title, Text } = Typography;

interface LotteryResult {
  id: number;
  time: string;
  prize: string;
  winner: string;
}

interface LotteryType {
  id: number;
  name: string;
  description: string;
}

const Home: React.FC = () => {
  const [jackpot, setJackpot] = useState<number>(10000); // 模拟奖池金额（ETH）
  const [latestResults, setLatestResults] = useState<LotteryResult[]>([
    { id: 1, time: '2025-02-25 14:00', prize: '5,000 ETH', winner: '0x123...456' },
    { id: 2, time: '2025-02-24 12:00', prize: '3,000 ETH', winner: '0x789...ABC' },
  ]);
  const [popularLotteries, setPopularLotteries] = useState<LotteryType[]>([
    { id: 1, name: '幸运数字彩票', description: '基于数字预测的经典彩票' },
    { id: 2, name: '抽奖型彩票', description: '随机抽奖，机会均等' },
    { id: 3, name: '特别活动彩票', description: '限时活动专属彩票' },
  ]);
  const navigate = useNavigate();
  const { isConnected } = useAccount(); // 可选，用于显示连接状态

  // 模拟数据变化（可选，模拟实时更新）
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => prev + Math.floor(Math.random() * 100)); // 随机增加奖池
    }, 5000); // 每 5 秒更新一次
    return () => clearInterval(interval); // 清理定时器
  }, []);

  const handleBuyNow = () => {
    if (!isConnected) {
      navigate('/login'); // 如果未连接钱包，跳转到登录页面
    } else {
      navigate('/lottery'); // 连接后跳转到彩票购买页面
    }
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: 'center', color: '#333333', marginBottom: '40px' }}>
        欢迎使用去中心化彩蛋娱乐平台
      </Title>
      <Row gutter={32} style={{ marginBottom: '40px' }}>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>奖池</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 更柔和的阴影
              backgroundColor: '#ffffff', // 白色卡片背景
              padding: '20px',
              transition: 'transform 0.3s', // 添加轻微动画
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Statistic 
              title="当前奖池" 
              value={jackpot} 
              precision={2} 
              suffix=" ETH" 
              valueStyle={{ color: '#d4a017' }} // 金色强调奖池金额
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>最新开奖信息</Text>} 
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
              dataSource={latestResults.slice(0, 1)} // 只显示最新一条
              renderItem={(result) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <Space direction="vertical" size="small">
                    <Text style={{ color: '#666666' }}>时间：{result.time}</Text>
                    <Text style={{ color: '#d4a017', fontWeight: 'bold' }}>奖项：{result.prize}</Text>
                    <Text style={{ color: '#666666' }}>获奖者：{result.winner}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>立即购买</Text>} 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
              backgroundColor: '#ffffff', 
              padding: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Button
              type="primary"
              size="large"
              onClick={handleBuyNow}
              style={{ 
                width: '100%', 
                marginTop: '16px', 
                background: 'linear-gradient(45deg, #1890ff, #40a9ff)', // 蓝色渐变
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                padding: '12px 24px',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #40a9ff, #1890ff)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #1890ff, #40a9ff)'}
            >
              立即购买
            </Button>
          </Card>
        </Col>
      </Row>
      <Row gutter={32}>
        <Col span={24}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>热门彩票类型</Text>} 
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
              dataSource={popularLotteries}
              renderItem={(lottery) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#333333', fontSize: '18px' }}>{lottery.name}</Text>
                    <Text style={{ color: '#666666', fontSize: '16px' }}>{lottery.description}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;