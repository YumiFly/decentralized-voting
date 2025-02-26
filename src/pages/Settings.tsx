import React, { useState } from 'react';
import { Button, Row, Col, Typography, Card, Form, Input, Switch, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi'; // 用于账户信息和断开连接

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Mock 数据：账户信息
  const accountInfo = {
    address: address || '0x123...456', // 使用钱包地址或模拟地址
    nickname: '彩蛋用户', // 模拟昵称
    registrationTime: '2025-01-01 12:00', // 模拟注册时间
  };

  // 通知设置状态
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handlePasswordChange = (values: any) => {
    if (!isConnected) {
      message.warning('请先连接钱包！');
      navigate('/login');
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      message.error('新密码与确认密码不一致！');
      return;
    }
    // 模拟密码修改逻辑
    message.success('密码修改成功！');
    form.resetFields();
  };

  const handleNotificationChange = (type: keyof typeof notifications, checked: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: checked,
    }));
    message.success(`已${checked ? '启用' : '禁用'}${type === 'email' ? '邮件' : type === 'sms' ? '短信' : '推送'}通知`);
  };

  const handleLogout = () => {
    if (!isConnected) {
      message.warning('未连接钱包，无需退出！');
      return;
    }
    disconnect();
    message.success('已退出登录！');
    navigate('/login'); // 跳转到登录页面
  };

  const handleBackToHome = () => {
    navigate('/'); // 返回首页
  };

  return (
    <div>
      {/* <Title level={1} style={{ textAlign: 'center', color: '#333333', marginBottom: '40px' }}>
        账户设置
      </Title> */}
      <Row gutter={32}>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>账户信息</Text>} 
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
            <Space direction="vertical" size="large">
              <Text strong style={{ color: '#333333', fontSize: '16px' }}>钱包地址：{accountInfo.address}</Text>
              <Text style={{ color: '#666666', fontSize: '14px' }}>昵称：{accountInfo.nickname}</Text>
              <Text style={{ color: '#666666', fontSize: '14px' }}>注册时间：{accountInfo.registrationTime}</Text>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>密码修改</Text>} 
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
            <Form form={form} onFinish={handlePasswordChange} layout="vertical">
              <Form.Item name="currentPassword" label="当前密码" rules={[{ required: true }]}>
                <Input.Password placeholder="请输入当前密码" />
              </Form.Item>
              <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
                <Input.Password placeholder="请输入新密码" />
              </Form.Item>
              <Form.Item name="confirmPassword" label="确认新密码" rules={[{ required: true }]}>
                <Input.Password placeholder="请确认新密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row gutter={32} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>通知设置</Text>} 
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
            <Space direction="vertical" size="large">
              <div>
                <Text style={{ color: '#333333', fontSize: '16px' }}>邮件通知</Text>
                <Switch 
                  checked={notifications.email} 
                  onChange={(checked) => handleNotificationChange('email', checked)}
                  style={{ marginLeft: '16px' }}
                />
              </div>
              <div>
                <Text style={{ color: '#333333', fontSize: '16px' }}>短信通知</Text>
                <Switch 
                  checked={notifications.sms} 
                  onChange={(checked) => handleNotificationChange('sms', checked)}
                  style={{ marginLeft: '16px' }}
                />
              </div>
              <div>
                <Text style={{ color: '#333333', fontSize: '16px' }}>推送通知</Text>
                <Switch 
                  checked={notifications.push} 
                  onChange={(checked) => handleNotificationChange('push', checked)}
                  style={{ marginLeft: '16px' }}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={<Text strong style={{ color: '#333333' }}>账户操作</Text>} 
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
            <Space direction="vertical" size="large">
              <Button 
                onClick={handleLogout} 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(45deg, #ff4d4f, #ff7875)', // 红色渐变，突出退出
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  padding: '12px 24px',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #ff7875, #ff4d4f)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #ff4d4f, #ff7875)'}
              >
                退出登录
              </Button>
            </Space>
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
            操作前请确保连接钱包
          </Text>
        )}
      </div>
    </div>
  );
};

export default Settings;