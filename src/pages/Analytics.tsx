import React from 'react';
import { Button, Row, Col, Typography, Card, Statistic, List, Space } from 'antd';
import { Line } from '@ant-design/charts'; // 使用 Ant Design Charts 绘制折线图
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'; // 可选，用于连接状态

const { Title, Text } = Typography;

interface SalesData {
  type: string;
  amount: number; // ETH
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  participationRate: number; // 百分比
}

interface JackpotTrend {
  date: string;
  value: number; // ETH
}

interface Activity {
  name: string;
  participants: number;
}

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount(); // 可选，用于显示连接状态

  // Mock 数据：彩票销售数据
  const salesData: SalesData[] = [
    { type: '幸运数字彩票', amount: 10000 },
    { type: '抽奖型彩票', amount: 5000 },
    { type: '特别活动彩票', amount: 3000 },
  ];
  const dailySales = 1500; // 每日销售额（ETH）

  // Mock 数据：用户参与统计
  const userStats: UserStats = {
    totalUsers: 1000,
    activeUsers: 800,
    participationRate: 80, // 百分比
  };

  // Mock 数据：奖池变动趋势（折线图数据）
  const jackpotTrend: JackpotTrend[] = [
    { date: '2025-02-20', value: 8000 },
    { date: '2025-02-21', value: 8500 },
    { date: '2025-02-22', value: 9000 },
    { date: '2025-02-23', value: 9500 },
    { date: '2025-02-24', value: 10000 },
    { date: '2025-02-25', value: 10500 },
  ];

  // Mock 数据：实时活动分析
  const activities: Activity[] = [
    { name: '幸运数字彩票', participants: 500 },
    { name: '抽奖型彩票', participants: 300 },
    { name: '特别活动彩票', participants: 200 },
  ];

  const handleBackToHome = () => {
    navigate('/'); // 返回首页
  };

  // 配置折线图
  const config = {
    data: jackpotTrend,
    xField: 'date',
    yField: 'value',
    height: 300,
    smooth: true,
    color: '#1890ff', // 蓝色线条，与按钮渐变一致
    style: {
      lineWidth: 2,
    },
    tooltip: {
      formatter: (datum: { date: string; value: number }) => ({
        name: '奖池金额',
        value: `${datum.value} ETH`,
      }),
    },
    axis: {
      y: { label: { formatter: (v: number) => `${v} ETH` } },
    },
  };

  return (
    <div>
      {/* <Title level={1} style={{ textAlign: 'center', color: '#333333', marginBottom: '40px' }}>
        数据监控与分析
      </Title> */}
      <Row gutter={32} style={{ marginBottom: '20px' }}>
        <Col span={6}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>总销售额</Text>} 
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
              value={salesData.reduce((sum, s) => sum + s.amount, 0)} 
              precision={2} 
              suffix=" ETH" 
              valueStyle={{ color: '#d4a017' }} // 金色强调金额
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>每日销售额</Text>} 
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
              title="今日" 
              value={dailySales} 
              precision={2} 
              suffix=" ETH" 
              valueStyle={{ color: '#d4a017' }} // 金色强调金额
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>用户总数</Text>} 
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
              title="总数" 
              value={userStats.totalUsers} 
              suffix=" 人" 
              valueStyle={{ color: '#333333' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>参与率</Text>} 
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
              title="活跃比例" 
              value={userStats.participationRate} 
              suffix=" %" 
              valueStyle={{ color: '#333333' }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={32} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>彩票销售数据</Text>} 
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
              dataSource={salesData}
              renderItem={(sale) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="horizontal" size="small">
                    <Text style={{ color: '#333333', fontSize: '16px' }}>{sale.type}</Text>
                    <Text strong style={{ color: '#d4a017', fontSize: '16px' }}>{sale.amount} ETH</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>奖池变动趋势</Text>} 
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
            <Line {...config} />
          </Card>
        </Col>
      </Row>
      <Row gutter={32}>
        <Col span={24}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>实时活动分析</Text>} 
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
              dataSource={activities}
              renderItem={(activity) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#333333', fontSize: '18px' }}>{activity.name}</Text>
                    <Text style={{ color: '#666666', fontSize: '16px' }}>参与人数：{activity.participants}</Text>
                  </Space>
                </List.Item>
              )}
            />
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
        </Button> */}
        {!isConnected && (
          <Text type="warning" style={{ marginTop: '16px', display: 'block', textAlign: 'center', color: '#ff4d4f' }}>
            查看详情前请确保连接钱包
          </Text>
        )}
      </div>
    </div>
  );
};

export default Analytics;