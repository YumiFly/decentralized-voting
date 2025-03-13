import React from 'react';
import { Row, Col, Typography, Card, Tag, Space } from 'antd';

const { Title, Text } = Typography;

const Results: React.FC = () => {
  const drawResults = [
    { lottery: '双色球', issue: '2025001', redNumbers: [3, 12, 17, 23, 28, 32], blueNumber: 7, date: '2025-03-11', prizes: { '一等奖': 5000000, '二等奖': 30000 } },
    { lottery: '七乐彩', issue: '2025002', numbers: [4, 9, 15, 18, 22, 26, 29], date: '2025-03-12', prizes: { '一等奖': 1000000, '二等奖': 5000 } },
    { lottery: '3D', issue: '2025003', numbers: [4, 7, 9], date: '2025-03-13', prizes: { '直选': 1000, '组三': 346 } },
  ];

  return (
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
      {drawResults.map((result, index) => (
        <Card
          key={index}
          title={<Text strong style={{ color: '#fff' }}>{result.lottery} - {result.issue}</Text>}
          bordered={false}
          style={{
            marginBottom: '20px',
            borderRadius: '12px',
            background: result.lottery === '双色球' ? 'linear-gradient(135deg, #ff4d4f, #ff7875)' :
              result.lottery === '七乐彩' ? 'linear-gradient(135deg, #fa8c16, #fadb14)' :
              'linear-gradient(135deg, #1890ff, #40a9ff)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '20px',
          }}
        >
          <Row>
            <Col span={12}>
              <Text style={{ color: '#fff' }}>开奖日期：{result.date}</Text>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Text style={{ color: '#fff' }}>开奖号码：</Text>
              <Space>
                {result.lottery === '双色球' ? (
                  [...(result.redNumbers ?? []), result.blueNumber].map((num, i) => ( // Provide a default empty array
                    <Tag
                      key={i}
                      color={i < 6 ? '#ff4d4f' : '#1890ff'}
                      style={{ borderRadius: '50%', width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center' }}
                    >
                      {num}
                    </Tag>
                  ))
                ) : result.lottery === '七乐彩' ? (
                  (result.numbers ?? []).map((num, i) => ( // Provide a default empty array
                    <Tag
                      key={i}
                      color="#fa8c16"
                      style={{ borderRadius: '50%', width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center' }}
                    >
                      {num}
                    </Tag>
                  ))
                ) : (
                  (result.numbers ?? []).map((num, i) => ( // Provide a default empty array
                    <Tag
                      key={i}
                      color="#1890ff"
                      style={{ borderRadius: '50%', width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center' }}
                    >
                      {num}
                    </Tag>
                  ))
                )}
              </Space>
            </Col>
            <Col span={24} style={{ marginTop: '16px' }}>
              <Text style={{ color: '#fff' }}>奖池信息：</Text>
              {Object.entries(result.prizes).map(([prize, amount]) => (
                <Text key={prize} style={{ color: '#fff', marginLeft: '10px' }}>
                  {prize}: {amount} 元
                </Text>
              ))}
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default Results;