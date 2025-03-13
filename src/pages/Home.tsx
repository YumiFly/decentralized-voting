import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Space, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const { Title, Text } = Typography;

// 彩票分类数据
const lotteryCategories = [
  { name: '即开型', color: '#fadb14' }, // 黄色
  { name: '乐透型', color: '#ff4d4f' }, // 红色
  { name: '数字型', color: '#1890ff' }, // 蓝色
  { name: '基诺型', color: '#eb2f96' }, // 紫色
];

// 彩票类型数据（与 Lottery.tsx 保持一致）
const lotteries = [
  { id: 1, name: '双色球', category: '乐透型', color: '#ff4d4f', icon: '🎰', route: 'shuangseqiu', description: '6红+1蓝，每周二、四、日开奖', price: 2 },
  { id: 2, name: '七乐彩', category: '乐透型', color: '#fa8c16', icon: '🌟', route: 'qilecai', description: '7个号码，每周三期', price: 2 },
  { id: 3, name: '3D', category: '数字型', color: '#1890ff', icon: '🎲', route: '3d', description: '3位号码，每天开奖', price: 2 },
];

// 模拟奖池数据
const prizePool = 1234567890;

// 模拟开奖信息数据
const drawResults = [
  { lottery: '双色球', issue: '2023001', numbers: ['01', '05', '12', '18', '22', '27', '+08'], date: '2023-01-01' },
  { lottery: '七乐彩', issue: '2023002', numbers: ['03', '07', '15', '19', '25', '28', '30'], date: '2023-01-02' },
  { lottery: '3D', issue: '2023003', numbers: ['4', '7', '9'], date: '2023-01-03' },
  { lottery: '快乐8', issue: '2023004', numbers: ['01', '03', '05', '07', '09', '11', '13', '15', '17', '19'], date: '2023-01-04' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [displayPrize, setDisplayPrize] = useState(0);

  // 模拟奖池金额滚动效果
  useEffect(() => {
    const target = prizePool;
    const increment = Math.ceil(target / 100);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayPrize(target);
        clearInterval(timer);
      } else {
        setDisplayPrize(current);
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  

  const handleLotteryClick = (route: string) => {
    navigate(`/lottery/${route}`);
  };

  const columns = [
    { title: '彩票类型', dataIndex: 'lottery', key: 'lottery' },
    { title: '期号', dataIndex: 'issue', key: 'issue' },
    {
      title: '开奖号码',
      dataIndex: 'numbers',
      key: 'numbers',
      render: (numbers: string[]) => (
        <Space>
          {numbers.map((num: string, index: number) => (
            <Tag
              key={index}
              color={num.includes('+') ? 'blue' : 'red'}
              style={{ borderRadius: '50%', width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center' }}
            >
              {num.replace('+', '')}
            </Tag>
          ))}
        </Space>
      ),
    },
    { title: '开奖日期', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
      {/* 标题 */}
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
          彩蛋娱乐彩票
        </Title>
      </div> */}

      {/* 分类 */}
      <Space size="large" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        {lotteryCategories.map(category => (
          <div
            key={category.name}
            style={{
              backgroundColor: category.color,
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {category.name}
          </div>
        ))}
      </Space>

      {/* 奖池信息 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '40px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          当前奖池金额
        </Title>
        <Title
          style={{
            fontSize: '48px',
            color: '#ff4d4f',
            fontWeight: 'bold',
            margin: '10px 0 0',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          ￥{displayPrize.toLocaleString()}
        </Title>
      </div>

      {/* 彩票列表 */}
      <Row gutter={[24, 24]} justify="center">
        {lotteries.map(lottery => (
          <Col key={lottery.name} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="lottery-card"
              style={{
                backgroundColor: lottery.color,
                borderRadius: '16px',
                overflow: 'hidden',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              onClick={() => handleLotteryClick(lottery.route)}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '40px',
                }}
              >
                {lottery.icon}
              </div>
              <Title level={4} style={{ color: '#fff', margin: 0 }}>
                {lottery.name}
              </Title>
              <Text style={{ color: '#fff', opacity: 0.8 }}>
                {lottery.category}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 开奖信息 */}
      <div style={{ marginTop: '40px' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#ff4d4f', marginBottom: '20px' }}>
          最近开奖信息
        </Title>
        <Table
          columns={columns}
          dataSource={drawResults}
          pagination={false}
          rowKey="issue"
          style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden' }}
          rowClassName={() => 'lottery-result-row'}
        />
      </div>
    </div>
  );
};

export default Home;