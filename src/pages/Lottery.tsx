import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Typography, Card, Select, InputNumber, Space, Statistic, message, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
// 修复 TS2865：使用 type 关键字进行类型导入
import { getLotteryTypes, getLotteries, getLatestIssue, buyTicket } from '../api/lottery';
import type { LotteryType, Lottery, LotteryIssue, BuyTicketRequest } from '../api/lottery';

const { Title, Text } = Typography;

interface LotterySelection {
  typeId: string;
  lotteryId: string;
  issue: LotteryIssue;
  redNumbers?: number[];
  blueNumber?: number;
  multiple?: number;
}

const Lottery: React.FC = () => {
  const { lotteryRoute } = useParams<{ lotteryRoute: string }>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [lotteryTypes, setLotteryTypes] = useState<LotteryType[]>([]);
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const [currentIssue, setCurrentIssue] = useState<LotteryIssue | null>(null);
  const [lotterySelection, setLotterySelection] = useState<LotterySelection | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [multiple, setMultiple] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  // 加载彩票类型和彩票列表
  useEffect(() => {
    const loadData = async () => {
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }
      try {
        const types = await getLotteryTypes();
        const lotteriesData = await getLotteries();
        setLotteryTypes(types);
        setLotteries(lotteriesData);

        const initialType = types.find(t => t.type_name.toLowerCase() === lotteryRoute?.toLowerCase())?.type_id || types[0]?.type_id;
        setSelectedType(initialType);
      } catch (error) {
        message.error('加载彩票数据失败');
      }
    };
    loadData();
  }, [navigate, lotteryRoute]);

  // 根据选中的彩票类型加载具体彩票和最新期号
  useEffect(() => {
    const loadLotteryDetails = async () => {
      if (!selectedType) return;
      try {
        const lottery = lotteries.find(l => l.type_id === selectedType);
        if (lottery) {
          setSelectedLottery(lottery);
          const issue = await getLatestIssue(lottery.lottery_id);
          setCurrentIssue(issue);
          setLotterySelection({ typeId: selectedType, lotteryId: lottery.lottery_id, issue, multiple: 1 });
          setBetAmount(parseFloat(lottery.ticket_price));
        }
      } catch (error) {
        message.error('加载彩票期号失败');
      }
    };
    loadLotteryDetails();
  }, [selectedType, lotteries]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setLotterySelection(null);
    setCurrentIssue(null);
    setBetAmount(0);
    setMultiple(1);
  };

  // 解析 betting_rules 确定选号规则
  const parseBettingRules = (rules: string): { redCount: number; redRange: [number, number]; blueCount?: number; blueRange?: [number, number] } => {
    try {
      const parsed = JSON.parse(rules);
      return {
        redCount: parsed.redCount || 6,
        redRange: parsed.redRange || [1, 33],
        blueCount: parsed.blueCount || 0,
        blueRange: parsed.blueRange || undefined,
      };
    } catch {
      return { redCount: 6, redRange: [1, 33], blueCount: 1, blueRange: [1, 16] }; // 默认双色球规则
    }
  };

  const handleNumberSelect = (number: number, isBlue?: boolean) => {
    if (!selectedLottery || !currentIssue) return;
    const rules = parseBettingRules(selectedLottery.betting_rules);

    setLotterySelection(prev => {
      if (!prev) return { typeId: selectedType, lotteryId: selectedLottery.lottery_id, issue: currentIssue, multiple: 1 };
      if (isBlue && rules.blueCount) {
        return { ...prev, blueNumber: number };
      }
      const numbers = prev.redNumbers || [];
      if (numbers.length < rules.redCount && !numbers.includes(number)) {
        numbers.push(number);
        return { ...prev, redNumbers: numbers.sort((a, b) => a - b).slice(0, rules.redCount) };
      }
      return prev;
    });
  };

  const handleRandomGenerate = () => {
    if (!selectedLottery || !currentIssue) return;
    const rules = parseBettingRules(selectedLottery.betting_rules);

    const generateNumbers = (range: [number, number], count: number) => {
      const numbers = new Set<number>();
      while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]);
      }
      return Array.from(numbers).sort((a, b) => a - b);
    };

    const redNumbers = generateNumbers(rules.redRange, rules.redCount);
    const blueNumber = rules.blueCount && rules.blueRange ? Math.floor(Math.random() * (rules.blueRange[1] - rules.blueRange[0] + 1)) + rules.blueRange[0] : undefined;
    setLotterySelection({ typeId: selectedType, lotteryId: selectedLottery.lottery_id, issue: currentIssue, redNumbers, blueNumber, multiple: 1 });
  };

  const handleMultipleChange = (value: number | null) => {
    if (!selectedLottery) return;
    const newMultiple = Math.min(Math.max(1, value || 1), 99);
    setMultiple(newMultiple);
    setBetAmount(parseFloat(selectedLottery.ticket_price) * newMultiple);
    if (lotterySelection) {
      setLotterySelection({ ...lotterySelection, multiple: newMultiple });
    }
  };

  const showConfirmModal = () => {
    if (!isConnected || !address || !localStorage.getItem('token')) {
      message.warning('请先登录！');
      navigate('/login');
      return;
    }
    if (!lotterySelection || !selectedLottery || !currentIssue) {
      message.error('请完成选号！');
      return;
    }

    const rules = parseBettingRules(selectedLottery.betting_rules);
    if (lotterySelection.redNumbers?.length !== rules.redCount || (rules.blueCount && !lotterySelection.blueNumber)) {
      message.error(`请选${rules.redCount}个红球${rules.blueCount ? `和${rules.blueCount}个蓝球` : ''}！`);
      return;
    }
    if (betAmount > 20000) {
      message.error('单张彩票金额不得超过20000 USDT！');
      return;
    }

    setIsConfirmModalVisible(true);
  };

  const handlePaymentConfirm = async () => {
    if (!lotterySelection || !selectedLottery || !address) return;

    setLoading(true);
    try {
      const ticketData: BuyTicketRequest = {
        ticket_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        issue_id: currentIssue!.issue_id,
        buyer_address: address,
        bet_content: JSON.stringify({ redNumbers: lotterySelection.redNumbers, blueNumber: lotterySelection.blueNumber }),
        purchase_amount: betAmount.toString(),
      };
      const result = await buyTicket(ticketData);
      message.success(`购买成功！票据 ID: ${result.ticket_id}, 支付金额: ${betAmount} USDT`);
      setIsConfirmModalVisible(false);
      navigate('/wallet');
    } catch (error) {
      message.error('购买失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalVisible(false);
  };

  const renderSelection = () => {
    if (!selectedLottery || !currentIssue) return null;
    const rules = parseBettingRules(selectedLottery.betting_rules);
    // 修复 TS2339：从 lotteryTypes 获取 description
    const typeDescription = lotteryTypes.find(t => t.type_id === selectedLottery.type_id)?.description || '暂无描述';

    const renderNumberButtons = (range: [number, number], isBlue?: boolean) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
        {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => i + range[0]).map(number => (
          <Button
            key={`${isBlue ? 'blue-' : ''}${number}`}
            type={isBlue ? lotterySelection?.blueNumber === number ? 'primary' : 'default' : lotterySelection?.redNumbers?.includes(number) ? 'primary' : 'default'}
            onClick={() => handleNumberSelect(number, isBlue)}
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              background: isBlue
                ? lotterySelection?.blueNumber === number ? '#1890ff' : '#fff'
                : lotterySelection?.redNumbers?.includes(number) ? '#ff4d4f' : '#fff',
              borderColor: isBlue
                ? lotterySelection?.blueNumber === number ? '#1890ff' : '#d9d9d9'
                : lotterySelection?.redNumbers?.includes(number) ? '#ff4d4f' : '#d9d9d9',
              color: isBlue || lotterySelection?.redNumbers?.includes(number) ? '#fff' : '#000',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              if (isBlue ? lotterySelection?.blueNumber !== number : !lotterySelection?.redNumbers?.includes(number)) {
                e.currentTarget.style.background = '#e6f7ff';
                e.currentTarget.style.borderColor = isBlue ? '#1890ff' : '#ff4d4f';
              }
            }}
            onMouseLeave={e => {
              if (isBlue ? lotterySelection?.blueNumber !== number : !lotterySelection?.redNumbers?.includes(number)) {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#d9d9d9';
              }
            }}
          >
            {number}
          </Button>
        ))}
      </div>
    );

    return (
      <div>
        <Text style={{ color: '#fff' }}>{typeDescription}：</Text>
        <Button onClick={handleRandomGenerate} style={{ marginLeft: '10px', background: '#ffd700', borderColor: '#ffd700', color: '#fff', borderRadius: '8px' }}>
          随机选号
        </Button>
        {renderNumberButtons(rules.redRange)}
        {rules.blueCount && rules.blueRange && renderNumberButtons(rules.blueRange, true)}
        <Text strong style={{ marginTop: '16px', color: '#fff' }}>
          已选号码：{lotterySelection?.redNumbers?.join(', ') || '无'}
          {lotterySelection?.blueNumber && ` + ${lotterySelection?.blueNumber}`}
        </Text>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (!currentIssue || !lotterySelection || !selectedLottery) return null;

    return (
      <Card
        title={<Text strong style={{ color: '#fff' }}>确认购买</Text>}
        bordered={false}
        style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ffd700, #ffaa00)', padding: '20px' }}
      >
        <Space direction="vertical" size="large">
          <Text strong style={{ color: '#fff' }}>彩票类型：{lotteryTypes.find(t => t.type_id === selectedType)?.type_name}</Text>
          <Text style={{ color: '#fff' }}>期号：{currentIssue.issue_number}</Text>
          <Text style={{ color: '#fff' }}>倒计时：{getCountdown(currentIssue.draw_time)}</Text>
          <Text style={{ color: '#fff' }}>
            号码：{lotterySelection.redNumbers?.join(', ') || '无'}
            {lotterySelection.blueNumber && ` + ${lotterySelection.blueNumber}`}
          </Text>
          <Text style={{ color: '#fff' }}>倍数：{multiple}倍</Text>
          <Text strong style={{ color: '#ff4d4f' }}>投注金额：{betAmount} USDT</Text>
          <Button type="primary" size="large" onClick={showConfirmModal} style={{ width: '100%', borderRadius: '8px' }}>
            立即支付
          </Button>
        </Space>
      </Card>
    );
  };

  const getCountdown = (drawTime: string) => {
    const now = Date.now();
    const diff = new Date(drawTime).getTime() - now;
    if (diff <= 0) return '已开奖';
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
      <div
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
          购买 {lotteryTypes.find(t => t.type_id === selectedType)?.type_name || '彩票'}
        </Title>
      </div>

      <Row gutter={32}>
        <Col span={8}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>选择彩票类型</Text>}
            bordered={false}
            style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ff4d4f, #ff7875)', padding: '20px' }}
          >
            <Select value={selectedType} onChange={handleTypeChange} style={{ width: '100%', marginBottom: '16px' }}>
              {lotteryTypes.map(type => (
                <Select.Option key={type.type_id} value={type.type_id}>
                  {type.type_name} - {type.description}
                </Select.Option>
              ))}
            </Select>
            {currentIssue && (
              <Statistic.Countdown
                title="开奖倒计时"
                value={new Date(currentIssue.draw_time).getTime()}
                format="mm:ss"
                valueStyle={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold' }}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>选号</Text>}
            bordered={false}
            style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #1890ff, #40a9ff)', padding: '20px' }}
          >
            {renderSelection()}
            <InputNumber
              min={1}
              max={99}
              value={multiple}
              onChange={handleMultipleChange}
              style={{ marginTop: '16px', width: '100%' }}
              addonAfter="倍"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>投注与支付</Text>}
            bordered={false}
            style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #fa8c16, #fadb14)', padding: '20px' }}
          >
            <Text strong style={{ color: '#fff' }}>投注金额 (USDT)</Text>
            <InputNumber value={betAmount} disabled style={{ width: '100%', marginBottom: '16px' }} addonAfter="USDT" />
            {renderConfirmation()}
            {!isConnected && (
              <Text type="warning" style={{ marginTop: '16px', display: 'block', textAlign: 'center', color: '#ff4d4f' }}>
                请先连接钱包
              </Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* 支付确认弹窗 */}
      <Modal
        title="确认支付"
        open={isConfirmModalVisible}
        onOk={handlePaymentConfirm}
        onCancel={handleCancelConfirm}
        okText="确认支付"
        cancelText="取消"
        confirmLoading={loading}
        centered
        style={{ borderRadius: '8px' }}
        bodyStyle={{ padding: '20px' }}
      >
        <Space direction="vertical" size="middle">
          <Text strong>彩票类型：{lotteryTypes.find(t => t.type_id === selectedType)?.type_name}</Text>
          <Text>期号：{currentIssue?.issue_number}</Text>
          <Text>号码：{lotterySelection?.redNumbers?.join(', ') || '无'}{lotterySelection?.blueNumber && ` + ${lotterySelection.blueNumber}`}</Text>
          <Text>倍数：{multiple}倍</Text>
          <Text strong type="danger">投注金额：{betAmount} USDT</Text>
          <Text>请确认以上信息，点击“确认支付”后将从您的钱包扣款。</Text>
        </Space>
      </Modal>
    </div>
  );
};

export default Lottery;