import React from 'react';
import { Row, Col, Typography, Card, Table } from 'antd';

const { Title, Text } = Typography;

const History: React.FC = () => {
  const historyData = [
    { key: '1', lottery: '双色球', issue: '2025001', numbers: '3, 12, 17, 23, 28, 32 + 7', date: '2025-03-11' },
    { key: '2', lottery: '七乐彩', issue: '2025002', numbers: '4, 9, 15, 18, 22, 26, 29', date: '2025-03-12' },
    { key: '3', lottery: '3D', issue: '2025003', numbers: '479', date: '2025-03-13' },
  ];

  const columns = [
    { title: '彩票类型', dataIndex: 'lottery', key: 'lottery' },
    { title: '期号', dataIndex: 'issue', key: 'issue' },
    { title: '开奖号码', dataIndex: 'numbers', key: 'numbers' },
    { title: '开奖日期', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
      {/* <Card
        bordered={false}
        style={{
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #40a9ff, #1890ff)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '20px',
        }}
      > */}
        <Table
          columns={columns}
          dataSource={historyData}
          pagination={{ pageSize: 5 }}
          style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}
        />
      {/* </Card> */}
    </div>
  );
};

export default History;