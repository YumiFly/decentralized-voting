import React from 'react';
import { Row, Col, Typography, Card, Form, Input, Button, message } from 'antd';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    message.success('账户信息已更新！');
    console.log('账户设置：', values);
  };

  return (
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
      <Row justify="center">
        <Col span={12}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>修改账户信息</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fa8c16, #fadb14)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                label={<Text strong style={{ color: '#fff' }}>用户名</Text>}
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item
                label={<Text strong style={{ color: '#fff' }}>邮箱</Text>}
                name="email"
                rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
              <Form.Item
                label={<Text strong style={{ color: '#fff' }}>手机号码</Text>}
                name="phone"
                rules={[{ required: true, message: '请输入手机号码' }]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #ff7875, #ff4d4f)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #ff4d4f, #ff7875)')}
                >
                  保存
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;