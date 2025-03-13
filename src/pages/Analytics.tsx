import React from 'react';
import { Row, Col, Typography, Card, Statistic, List, Space} from 'antd';
import { Line } from '@ant-design/charts';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const { Title, Text  } = Typography;

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
  const { isConnected } = useAccount();

  // 彩票销售情况，与 Home.tsx 和 Lottery.tsx 统一
  const salesData: SalesData[] = [
    { type: '双色球', amount: 10000 },
    { type: '七乐彩', amount: 5000 },
    { type: '3D', amount: 3000 },
  ];
  const dailySales = 1500; // 每日销售额（ETH）

  // 用户参与统计
  const userStats: UserStats = {
    totalUsers: 1000,
    activeUsers: 800,
    participationRate: 80,
  };

  // 奖池变动趋势
  const jackpotTrend: JackpotTrend[] = [
    { date: '2025-02-20', value: 8000 },
    { date: '2025-02-21', value: 8500 },
    { date: '2025-02-22', value: 9000 },
    { date: '2025-02-23', value: 9500 },
    { date: '2025-02-24', value: 10000 },
    { date: '2025-02-25', value: 10500 },
  ];

  // 实时活动分析，与 Home.tsx 和 Lottery.tsx 统一
  const activities: Activity[] = [
    { name: '双色球', participants: 500 },
    { name: '七乐彩', participants: 300 },
    { name: '3D', participants: 200 },
  ];

  const config = {
    data: jackpotTrend,
    xField: 'date',
    yField: 'value',
    height: 300,
    smooth: true,
    color: '#1890ff',
    style: { lineWidth: 2 },
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
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
      {/* <div
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
          数据监控与分析
        </Title>
      </div> */}
      <Row gutter={32} style={{ marginBottom: '20px' }}>
        <Col span={6}>
          <Card
            title={<Text strong style={{ color: '#ff4d4f' }}>总销售额</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Statistic
              title="总计"
              value={salesData.reduce((sum, s) => sum + s.amount, 0)}
              precision={2}
              suffix=" ETH"
              valueStyle={{ color: '#d4a017' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={<Text strong style={{ color: '#ff4d4f' }}>每日销售额</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Statistic
              title="今日"
              value={dailySales}
              precision={2}
              suffix=" ETH"
              valueStyle={{ color: '#d4a017' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={<Text strong style={{ color: '#ff4d4f' }}>用户总数</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Statistic
              title="总数"
              value={userStats.totalUsers}
              suffix=" 人"
              valueStyle={{ color: '#333' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={<Text strong style={{ color: '#ff4d4f' }}>参与率</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Statistic
              title="活跃比例"
              value={userStats.participationRate}
              suffix=" %"
              valueStyle={{ color: '#333' }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={32} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card
            title={<Text strong style={{ color: '#1890ff' }}>彩票销售情况</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <List
              dataSource={salesData}
              renderItem={(sale) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="horizontal" size="small">
                    <Text style={{ color: '#333', fontSize: '16px' }}>{sale.type}</Text>
                    <Text strong style={{ color: '#d4a017', fontSize: '16px' }}>{sale.amount} ETH</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<Text strong style={{ color: '#fa8c16' }}>奖池变动趋势</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Line {...config} />
          </Card>
        </Col>
      </Row>
      <Row gutter={32}>
        <Col span={24}>
          <Card
            title={<Text strong style={{ color: '#52c41a' }}>实时活动分析</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <List
              dataSource={activities}
              renderItem={(activity) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#333', fontSize: '18px' }}>{activity.name}</Text>
                    <Text style={{ color: '#666', fontSize: '16px' }}>参与人数：{activity.participants}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
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