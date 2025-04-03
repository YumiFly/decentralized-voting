import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Space, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getLotteryTypes, getLotteries, getPrizePool, LotteryType, Lottery } from '../api/lottery';
import '../css/Home.css';

const { Title, Text } = Typography;

// 图片映射（直接使用 URL 路径）
const lotteryImages: { [key: string]: string } = {
  shuangseqiu: '../assets/lottery-shuangseqiu.png',
  qilecai: '../assets/lottery-qilecai.png',
  '3d': '../assets/lottery-3d.png',
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [lotteryTypes, setLotteryTypes] = useState<LotteryType[]>([]);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [displayPrize, setDisplayPrize] = useState(0);

  // 模拟开奖信息（假设后端未提供接口，实际应替换为真实 API）
  const drawResults = [
    { lottery: '双色球', issue: '2023001', numbers: ['01', '05', '12', '18', '22', '27', '+08'], date: '2023-01-01' },
    { lottery: '七乐彩', issue: '2023002', numbers: ['03', '07', '15', '19', '25', '28', '30'], date: '2023-01-02' },
    { lottery: '3D', issue: '2023003', numbers: ['4', '7', '9'], date: '2023-01-03' },
  ];

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const types = await getLotteryTypes();
        const lotteryData = await getLotteries();
        const prize = await getPrizePool();
        setLotteryTypes(types);
        setLotteries(lotteryData);

        // 奖池滚动效果
        const target = prize;
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
      } catch (error) {
        console.error('加载首页数据失败:', error);
      }
    };
    loadData();
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

  // 根据 type_id 获取类型名称
  const getTypeName = (typeId: string) => lotteryTypes.find(t => t.type_id === typeId)?.type_name || '未知类型';

  // 动态生成路由
  const getRoute = (lotteryName: string) => lotteryName.toLowerCase().replace(/\s+/g, '');

  // 动态分配颜色（作为备用，如果图片加载失败）
  const getColor = (index: number) => {
    const colors = ['#fadb14', '#ff4d4f', '#1890ff', '#eb2f96', '#fa8c16'];
    return colors[index % colors.length];
  };

  return (
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
      {/* 彩票分类 */}
      <Space size="large" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        {lotteryTypes.map((category, index) => (
          <div
            key={category.type_id}
            style={{
              backgroundColor: getColor(index),
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {category.type_name}
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
        {lotteries.map((lottery, index) => {
          const typeName = getTypeName(lottery.type_id);
          const route = getRoute(typeName);
          const imageSrc = lotteryImages[route] || '';

          return (
            <Col key={lottery.lottery_id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="lottery-card"
                style={{
                  backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
                  backgroundColor: imageSrc ? 'transparent' : getColor(index),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  position: 'relative',
                  color: '#fff',
                }}
                onClick={() => handleLotteryClick(route)}
              >
                {/* 半透明遮罩层，增强文字可读性 */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '16px',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '20px',
                  }}
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
                    🎲
                  </div>
                  <Title level={4} style={{ color: '#fff', margin: 0 }}>
                    {typeName}
                  </Title>
                  <Text style={{ color: '#fff', opacity: 0.8 }}>
                    单价: {lottery.ticket_price} USDT
                  </Text>
                </div>
              </Card>
            </Col>
          );
        })}
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