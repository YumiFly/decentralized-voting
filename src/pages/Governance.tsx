import React, { useState } from 'react';
import { Button, Row, Col, Typography, Card, List, Form, Input, DatePicker, Radio, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const { Title, Text } = Typography;

interface Proposal {
  id: number;
  title: string;
  description: string;
  endTime: string;
  votesFor: number;
  votesAgainst: number;
  status: 'Pending' | 'Executed' | 'Rejected';
}

const Governance: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([
    { id: 1, title: '增加奖池资金', description: '提议增加奖池资金至 20,000 ETH', endTime: '2025-03-10', votesFor: 150, votesAgainst: 50, status: 'Pending' },
    { id: 2, title: '修改彩票规则', description: '提议修改幸运数字彩票的选号规则', endTime: '2025-03-05', votesFor: 200, votesAgainst: 30, status: 'Executed' },
  ]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const handleSubmitProposal = (values: any) => {
    if (!isConnected) {
      message.warning('请先连接钱包！');
      navigate('/login');
      return;
    }
    const newProposal: Proposal = {
      id: proposals.length + 1,
      title: values.title,
      description: values.description,
      endTime: values.endTime.format('YYYY-MM-DD'),
      votesFor: 0,
      votesAgainst: 0,
      status: 'Pending',
    };
    setProposals([newProposal, ...proposals]);
    form.resetFields();
    message.success('提案提交成功！');
  };

  const handleVote = (proposalId: number, vote: 'for' | 'against') => {
    if (!isConnected) {
      message.warning('请先连接钱包！');
      navigate('/login');
      return;
    }
    setProposals(proposals.map((p) =>
      p.id === proposalId ? {
        ...p,
        votesFor: vote === 'for' ? p.votesFor + 1 : p.votesFor,
        votesAgainst: vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst,
      } : p
    ));
    message.success(`已提交${vote === 'for' ? '支持' : '反对'}投票！`);
  };

  const handleExecute = (proposalId: number) => {
    if (!isConnected) {
      message.warning('请先连接钱包！');
      navigate('/login');
      return;
    }
    setProposals(proposals.map((p) =>
      p.id === proposalId ? { ...p, status: 'Executed' } : p
    ));
    message.success('提案已执行！');
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
          平台治理
        </Title>
      </div> */}
      <Row gutter={32}>
        <Col span={12}>
          <Card
            title={<Text strong style={{ color: '#ff4d4f' }}>提交新提案</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff', // 改为白色背景
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Form form={form} onFinish={handleSubmitProposal} layout="vertical">
              <Form.Item name="title" label={<Text strong>提案标题</Text>} rules={[{ required: true, message: '请输入提案标题' }]}>
                <Input placeholder="请输入提案标题" />
              </Form.Item>
              <Form.Item name="description" label={<Text strong>提案描述</Text>} rules={[{ required: true, message: '请输入提案描述' }]}>
                <Input.TextArea placeholder="请输入提案描述" />
              </Form.Item>
              <Form.Item name="endTime" label={<Text strong>截止时间</Text>} rules={[{ required: true, message: '请选择截止时间' }]}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%', background: '#ffd700', borderColor: '#ffd700', color: '#fff', borderRadius: '8px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#ffaa00')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#ffd700')}
                >
                  提交提案
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<Text strong style={{ color: '#1890ff' }}>当前提案</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff', // 改为白色背景
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <List
              dataSource={proposals.filter((p) => p.status === 'Pending')}
              renderItem={(proposal) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#333', fontSize: '16px' }}>{proposal.title}</Text>
                    <Text style={{ color: '#666', fontSize: '14px' }}>{proposal.description}</Text>
                    <Text style={{ color: '#666', fontSize: '14px' }}>截止时间：{proposal.endTime}</Text>
                    <Text style={{ color: '#666', fontSize: '14px' }}>
                      投票：支持 {proposal.votesFor}，反对 {proposal.votesAgainst}
                    </Text>
                    <Space>
                      <Button
                        onClick={() => handleVote(proposal.id, 'for')}
                        style={{ background: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#73d13d')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#52c41a')}
                      >
                        支持
                      </Button>
                      <Button
                        onClick={() => handleVote(proposal.id, 'against')}
                        style={{ background: '#ff4d4f', borderColor: '#ff4d4f', color: '#fff' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#ff7875')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ff4d4f')}
                      >
                        反对
                      </Button>
                      <Button
                        onClick={() => handleExecute(proposal.id)}
                        style={{ background: '#faad14', borderColor: '#faad14', color: '#fff' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#ffc53d')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#faad14')}
                      >
                        执行
                      </Button>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={32} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card
            title={<Text strong style={{ color: '#fa8c16' }}>已执行提案</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: '#ffffff', // 改为白色背景
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <List
              dataSource={proposals.filter((p) => p.status === 'Executed')}
              renderItem={(proposal) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#333', fontSize: '16px' }}>{proposal.title}</Text>
                    <Text style={{ color: '#666', fontSize: '14px' }}>{proposal.description}</Text>
                    <Text style={{ color: '#666', fontSize: '14px' }}>执行时间：{proposal.endTime}</Text>
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
            操作前请确保连接钱包
          </Text>
        )}
      </div>
    </div>
  );
};

export default Governance;