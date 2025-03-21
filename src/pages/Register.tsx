import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Steps, Form, Input, Upload, Button, message, Typography, Row, Col, Card } from 'antd';
import { UploadOutlined, WalletOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // 模拟文件上传
  const uploadProps = {
    beforeUpload: (file: File) => {
      message.success(`${file.name} 上传成功（模拟）`);
      return false; // 阻止自动上传，实际需实现上传逻辑
    },
  };

  // 连接钱包
  const handleConnectWallet = () => {
    if (!isConnected) {
      open(); // 打开钱包选择弹框
    } else {
      disconnect(); // 断开钱包连接
      form.setFieldsValue({ walletAddress: undefined }); // 清空钱包地址
    }
  };

  // 连接钱包后更新表单
  React.useEffect(() => {
    if (isConnected && address) {
      form.setFieldsValue({ walletAddress: address });
    }
  }, [isConnected, address, form]);

  // 下一步
  const nextStep = () => {
    form.validateFields().then(() => {
      // 在“连接钱包”步骤时，确保 walletAddress 已填充
      if (currentStep === 1 && !form.getFieldValue('walletAddress')) {
        message.warning('请先连接钱包！');
        return;
      }
      setCurrentStep(currentStep + 1);
    });
  };

  // 上一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 提交注册信息
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 模拟提交注册信息
      console.log('注册信息:', values);
      // 提交成功后断开钱包
      disconnect();
      form.setFieldsValue({ walletAddress: undefined }); // 清空钱包地址
      message.success('注册成功！当前 KYC 待审批，3 个工作日内审批通过后会通知您。');
      navigate('/'); // 提交后跳转到首页
    });
  };

  // 步骤内容
  const steps = [
    {
      title: '基础信息',
      content: (
        <>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入您的姓名！' }]}
          >
            <Input placeholder="请输入您的姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址！' }]}
          >
            <Input placeholder="请输入您的邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话"
            rules={[{ required: true, pattern: /^\d{11}$/, message: '请输入有效的11位手机号码！' }]}
          >
            <Input placeholder="请输入您的电话号码" />
          </Form.Item>
        </>
      ),
    },
    {
      title: '连接钱包',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Form.Item
            name="walletAddress"
            label="钱包地址"
            rules={[{ required: true, message: '请连接钱包！' }]}
          >
            {isConnected && address ? (
              <Card
                style={{
                  margin: '0 auto',
                  maxWidth: '400px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                  <WalletOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginRight: '8px' }} />
                  <Text style={{ fontSize: '16px', color: '#333' }}>
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </Text>
                </div>
              </Card>
            ) : (
              <Text type="secondary">请连接钱包以获取地址</Text>
            )}
          </Form.Item>
          <Button
            block
            style={{
              height: '50px',
              fontSize: '16px',
              background: isConnected
                ? 'linear-gradient(135deg, #ff7875, #ff4d4f)'
                : 'linear-gradient(135deg, #ff4d4f, #ff7875)',
              border: 'none',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              maxWidth: '300px',
              color: '#fff',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = isConnected
                ? 'linear-gradient(135deg, #ff4d4f, #ff7875)'
                : 'linear-gradient(135deg, #ff7875, #ff4d4f)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = isConnected
                ? 'linear-gradient(135deg, #ff7875, #ff4d4f)'
                : 'linear-gradient(135deg, #ff4d4f, #ff7875)')
            }
            onClick={handleConnectWallet}
          >
            <WalletOutlined style={{ marginRight: '8px' }} />
            {isConnected ? '断开钱包' : '连接钱包'}
          </Button>
        </div>
      ),
    },
    {
      title: '证件信息',
      content: (
        <>
          <Form.Item
            name="idNumber"
            label="身份证号"
            rules={[{ required: true, message: '请输入您的身份证号！' }]}
          >
            <Input placeholder="请输入您的身份证号" />
          </Form.Item>
          <Form.Item
            name="idPhoto"
            label="身份证照片"
            rules={[{ required: true, message: '请上传身份证照片！' }]}
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload {...uploadProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>上传身份证照片</Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
    {
      title: '地址证明',
      content: (
        <>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入您的地址！' }]}
          >
            <Input placeholder="请输入您的地址" />
          </Form.Item>
          <Form.Item
            name="addressProof"
            label="地址证明照片"
            rules={[{ required: true, message: '请上传地址证明照片！' }]}
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload {...uploadProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>上传地址证明照片</Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
    {
      title: '描述',
      content: (
        <Form.Item
          name="description"
          label="自我描述"
          rules={[{ required: true, message: '请输入您的描述！' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入您的自我描述或备注" />
        </Form.Item>
      ),
    },
    {
      title: '提交',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
            请确认您的信息：
          </Text>
          <div style={{ textAlign: 'left', marginBottom: '24px', padding: '16px', background: '#fff', borderRadius: '8px' }}>
            <Text strong>基础信息</Text>
            <br />
            <Text>姓名: {form.getFieldValue('name') || '未填写'}</Text>
            <br />
            <Text>邮箱: {form.getFieldValue('email') || '未填写'}</Text>
            <br />
            <Text>电话: {form.getFieldValue('phone') || '未填写'}</Text>
            <br />
            <br />
            <Text strong>钱包信息</Text>
            <br />
            <Text>钱包地址: {form.getFieldValue('walletAddress') || '未连接'}</Text>
            <br />
            <br />
            <Text strong>证件信息</Text>
            <br />
            <Text>身份证号: {form.getFieldValue('idNumber') || '未填写'}</Text>
            <br />
            <Text>
              身份证照片: {form.getFieldValue('idPhoto')?.[0]?.name || '未上传'}
            </Text>
            <br />
            <br />
            <Text strong>地址证明</Text>
            <br />
            <Text>地址: {form.getFieldValue('address') || '未填写'}</Text>
            <br />
            <Text>
              地址证明照片: {form.getFieldValue('addressProof')?.[0]?.name || '未上传'}
            </Text>
            <br />
            <br />
            <Text strong>描述</Text>
            <br />
            <Text>{form.getFieldValue('description') || '未填写'}</Text>
          </div>
          <Text>请确认您的信息无误，点击提交完成注册。</Text>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px', background: '#e6f7ff', textAlign: 'center' }}>
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
          用户注册
        </Title>
      </div>
      <Row justify="center">
        <Col span={12}>
          <Steps current={currentStep} style={{ marginBottom: '40px' }}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <Form form={form} layout="vertical">
            {steps[currentStep].content}
          </Form>
          <div style={{ marginTop: '24px' }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: '8px' }} onClick={prevStep}>
                上一步
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={nextStep}>
                下一步
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{
                  background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                  border: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #ff7875, #ff4d4f)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #ff4d4f, #ff7875)')}
              >
                提交
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;