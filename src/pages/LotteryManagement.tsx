import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, message, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import '../css/LotteryManagement.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface LotteryManagement {
  id: number;
  name: string;
  issueDate: string;
  issueQuantity: number;
  price: number;
  drawDate: string;
  description: string;
  color: string;
  icon: string;
  status: '待发行' | '已发行' | '已开奖' | '已销毁'|'待开奖';
}

const LotteryManagement: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [form] = Form.useForm();
  const [lotteries, setLotteries] = useState<LotteryManagement[]>([]);
  const [userRole, setUserRole] = useState<'unlogged' | 'user' | 'issuer' | 'admin'>('unlogged');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock 初始数据
  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'unlogged';
    setUserRole(role as 'unlogged' | 'user' | 'issuer' | 'admin');

    const initialLotteries: LotteryManagement[] = [
      {
        id: 1,
        name: '双色球',
        issueDate: '2025-03-01',
        issueQuantity: 10000,
        price: 0.1,
        drawDate: '2025-03-15',
        description: '经典乐透彩票',
        color: '#ff4d4f',
        icon: '🎰',
        status: '已发行',
      },
      {
        id: 2,
        name: '刮刮乐',
        issueDate: '2025-03-05',
        issueQuantity: 5000,
        price: 0.15,
        drawDate: '2025-03-10',
        description: '即开即中',
        color: '#ff7875',
        icon: '🔥',
        status: '待开奖',
      },
      {
        id: 3,
        name: '大乐透',
        issueDate: '2025-03-08',
        issueQuantity: 5000,
        price: 2,
        drawDate: '2025-03-10',
        description: '即开即中',
        color: '#ff7875',
        icon: '🔥',
        status: '待开奖',
      },
    ];
    setLotteries(initialLotteries);
  }, []);

  // 样式模版选项
  const styleTemplates = [
    { color: '#ff4d4f', icon: '🎰', label: '红色乐透风格' },
    { color: '#ff7875', icon: '🔥', label: '橙红即开风格' },
    { color: '#1890ff', icon: '🎲', label: '蓝色数字风格' },
    { color: '#eb2f96', icon: '🎉', label: '紫色基诺风格' },
    { color: '#fa8c16', icon: '🌟', label: '金色七乐风格' },
  ];

  // 权限检查
 // const canManage = userRole === 'issuer' || userRole === 'admin';
  if (!true) {
    useEffect(() => {
      message.warning('您无权访问彩票管理页面，请登录发行人员或管理员账户！');
      navigate('/');
    }, [navigate]);
    return <Spin size="large" />;
  }

  // 表格列
  const columns = [
    { title: '彩票名称', dataIndex: 'name', key: 'name' },
    { title: '发行时间', dataIndex: 'issueDate', key: 'issueDate' },
    { title: '发行数量', dataIndex: 'issueQuantity', key: 'issueQuantity' },
    { title: '单价 (USDT)', dataIndex: 'price', key: 'price' },
    { title: '开奖时间', dataIndex: 'drawDate', key: 'drawDate' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: LotteryManagement) => (
        <Space>
          {record.status === '待开奖' && (
            <Button
              type="primary"
              onClick={() => handleDraw(record.id)}
              style={{ background: '#ff4d4f', borderColor: '#ff4d4f', borderRadius: '8px' }}
            >
              立即开奖
            </Button>
          )}
          {record.status !== '已销毁' && (
            <Button
              danger
              onClick={() => handleDestroy(record.id)}
              style={{ borderRadius: '8px' }}
            >
              销毁
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 显示注册弹窗
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 处理注册提交
  const handleRegister = (values: any) => {
    const newLottery: LotteryManagement = {
      id: lotteries.length + 1,
      name: values.name,
      issueDate: values.issueDate.format('YYYY-MM-DD'),
      issueQuantity: values.issueQuantity,
      price: values.price,
      drawDate: values.drawDate.format('YYYY-MM-DD'),
      description: '即开即中',
      color: '#ff7875',
      icon: '🔥',
    //   description: values.description,
    //   color: values.template.color,
    //   icon: values.template.icon,
      status: '待发行',
    };
    setLotteries([...lotteries, newLottery]);
    message.success(`彩票 "${values.name}" 注册成功！`);
    setIsModalVisible(false);
    form.resetFields();
  };

  // 取消注册
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 处理开奖
  const handleDraw = (id: number) => {
    setLotteries(lotteries.map(l => (l.id === id ? { ...l, status: '已开奖' } : l)));
    message.success(`彩票 ID ${id} 已开奖！`);
  };

  // 处理销毁
  const handleDestroy = (id: number) => {
    setLotteries(lotteries.map(l => (l.id === id ? { ...l, status: '已销毁' } : l)));
    message.success(`彩票 ID ${id} 已销毁！`);
  };

//   // 退出登录
//   const handleLogout = () => {
//     disconnect();
//     localStorage.removeItem('userRole');
//     setUserRole('unlogged');
//     navigate('/');
//     message.success('已退出登录');
//   };

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
          彩票管理
        </Title>
      </div> */}

      {/* 彩票列表 */}
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #ff7875, #ff4d4f)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #ff4d4f, #ff7875)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          注册彩票
        </Button>
        {/* <Button
          onClick={handleLogout}
          style={{
            marginLeft: '16px',
            background: '#d9d9d9',
            borderColor: '#d9d9d9',
            borderRadius: '12px',
            padding: '8px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#bfbfbf';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#d9d9d9';
          }}
        >
          退出登录
        </Button>*/}
      </div> 
      <Table
        columns={columns}
        dataSource={lotteries}
        rowKey="id"
        pagination={false}
        style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}
        title={() => (
          <Text strong style={{ color: '#ff4d4f', fontSize: '18px' }}>
            当前彩票列表
          </Text>
        )}
      />

      {/* 注册弹窗 */}
      <Modal
        title={<Text strong style={{ color: '#ff4d4f',fontSize: '18px'}}>注册彩票</Text>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form
          form={form}
          name="lotteryManagement"
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label={<Text strong>彩票名称</Text>}
            rules={[{ required: true, message: '请输入彩票名称！' }]}
          >
            <Input placeholder="请输入彩票名称" />
          </Form.Item>

          <Form.Item
            name="issueDate"
            label={<Text strong>发行时间</Text>}
            rules={[{ required: true, message: '请选择发行时间！' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="issueQuantity"
            label={<Text strong>发行数量</Text>}
            rules={[{ required: true, message: '请输入发行数量！' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="price"
            label={<Text strong>单价 (USDT)</Text>}
            rules={[{ required: true, message: '请输入单价！' }]}
          >
            <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="drawDate"
            label={<Text strong>开奖时间</Text>}
            rules={[{ required: true, message: '请选择开奖时间！' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label={<Text strong>描述</Text>}
            rules={[{ required: true, message: '请输入描述！' }]}
          >
            <Input.TextArea placeholder="请输入彩票描述" />
          </Form.Item>

          {/* <Form.Item
            name="template"
            label={<Text strong>样式模版</Text>}
            rules={[{ required: true, message: '请选择样式模版！' }]}
          >
            <Select placeholder="选择样式模版">
              {styleTemplates.map((template, index) => (
                <Option key={index} value={template}>
                  <Space>
                    <span style={{ color: template.color }}>{template.icon}</span>
                    {template.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button
                onClick={handleCancel}
                style={{
                  width: '100%',
                  background: '#d9d9d9',
                  borderColor: '#d9d9d9',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#bfbfbf';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#d9d9d9';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff7875, #ff4d4f)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff4d4f, #ff7875)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                确认注册
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LotteryManagement;