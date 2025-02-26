import React from 'react';
import { Button, Row, Col, Typography, Card, List, Space, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi'; // 可选，用于连接状态

const { Title, Text } = Typography;

interface PrizeLevel {
  level: string;
  amount: number; // 奖金金额（ETH）
  count: number; // 中奖人数
}

interface Winner {
  address: string;
  prize: number; // 奖金金额（ETH）
}

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount(); // 可选，用于显示连接状态

  // Mock 数据：中奖信息
  const winningNumbers = [3, 15, 22, 34, 45, 49]; // 模拟中奖号码
  const prizeDistribution: PrizeLevel[] = [
    { level: '一等奖', amount: 5000, count: 1 },
    { level: '二等奖', amount: 1000, count: 5 },
    { level: '三等奖', amount: 100, count: 50 },
  ];
  const winners: Winner[] = [
    { address: '0x123...456', prize: 5000 },
    { address: '0x789...ABC', prize: 1000 },
    { address: '0xDEF...GHI', prize: 1000 },
    { address: '0xJKL...MNO', prize: 100 },
    { address: '0xPQR...STU', prize: 100 },
    // 添加更多中奖者...
  ];

  const handleBackToHome = () => {
    navigate('/'); // 返回首页
  };

  return (
    <div>
      {/* <Title level={1} style={{ textAlign: 'center', color: '#333333', marginBottom: '40px' }}>
        开奖信息
      </Title> */}
      <Row gutter={32}>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>中奖号码</Text>} 
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
            <Text strong style={{ color: '#333333', fontSize: '20px' }}>
              中奖号码：{winningNumbers.join(', ')}
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>奖金分配</Text>} 
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
              dataSource={prizeDistribution}
              renderItem={(prize) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#333333', fontSize: '18px' }}>{prize.level}</Text>
                    <Text style={{ color: '#666666', fontSize: '16px' }}>
                      奖金：{prize.amount} ETH，{prize.count} 人
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>中奖者列表</Text>} 
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
              dataSource={winners.slice(0, 5)} // 只显示前 5 个中奖者
              renderItem={(winner) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="horizontal" size="small">
                    <Text style={{ color: '#333333', fontSize: '16px' }}>{winner.address}</Text>
                    <Text strong style={{ color: '#d4a017', fontSize: '16px' }}>- {winner.prize} ETH</Text>
                  </Space>
                </List.Item>
              )}
            />
            {winners.length > 5 && (
              <Text style={{ color: '#666666', marginTop: '8px', display: 'block', textAlign: 'center' }}>
                更多中奖者请查看历史记录
              </Text>
            )}
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

export default Results;