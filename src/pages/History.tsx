// pages/History.tsx
import React from 'react';
import { Button, Row, Col, Typography, Card, List, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'; // 可选，用于连接状态

const { Title, Text } = Typography;

interface TicketHistory {
  id: number;
  lotteryType: string;
  numbers: number[];
  time: string;
  amount: number; // ETH
}

interface WinHistory {
  id: number;
  lotteryType: string;
  prize: number; // ETH
  time: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount(); // 可选，用于显示连接状态

  // Mock 数据：购票历史
  const ticketHistory: TicketHistory[] = [
    { id: 1, lotteryType: '幸运数字彩票', numbers: [1, 5, 12, 23, 38, 45], time: '2025-02-25 10:00', amount: 0.1 },
    { id: 2, lotteryType: '抽奖型彩票', numbers: [3, 15, 22, 34, 40, 49], time: '2025-02-24 09:30', amount: 0.15 },
    { id: 3, lotteryType: '特别活动彩票', numbers: [7, 14, 25, 36, 42, 48], time: '2025-02-23 15:00', amount: 0.2 },
  ];

  // Mock 数据：中奖历史
  const winHistory: WinHistory[] = [
    { id: 1, lotteryType: '幸运数字彩票', prize: 5000, time: '2025-02-25 14:00' },
    { id: 2, lotteryType: '抽奖型彩票', prize: 1000, time: '2025-02-24 12:00' },
  ];

  const handleBackToHome = () => {
    navigate('/'); // 返回首页
  };

  return (
    <div>
      {/* <Title level={1} style={{ textAlign: 'center', color: '#333333', marginBottom: '40px' }}>
        历史记录
      </Title> */}
      <Row gutter={32}>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>购票历史</Text>} 
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
              dataSource={ticketHistory}
              renderItem={(ticket) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#333333', fontSize: '16px' }}>
                      {ticket.lotteryType} - 号码：{ticket.numbers.join(', ')}
                    </Text>
                    <Text style={{ color: '#666666', fontSize: '14px' }}>
                      时间：{ticket.time}，金额：{ticket.amount} ETH
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>中奖历史</Text>} 
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
              dataSource={winHistory}
              renderItem={(win) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#333333', fontSize: '16px' }}>
                      {win.lotteryType}
                    </Text>
                    <Text style={{ color: '#666666', fontSize: '14px' }}>
                      时间：{win.time}，奖金：{win.prize} ETH
                    </Text>
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

export default History;