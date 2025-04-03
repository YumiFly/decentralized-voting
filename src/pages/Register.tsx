import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Steps, Form, Input, Upload, Button, message, Typography, Row, Col, Card, DatePicker, Select, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { uploadPhoto, registerCustomer, CustomerRequest } from '../api/customer';
import '../css/Register.css';

const { Step } = Steps;
const { Title, Text } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  // 检查是否已连接钱包，未连接则跳转到登录页面
  React.useEffect(() => {
    if (!isConnected || !address) {
      message.warning('请先连接钱包！');
      navigate('/login');
    } else {
      form.setFieldsValue({ customer_address: address });
    }
  }, [isConnected, address, form, navigate]);

  // 文件上传逻辑
  const uploadProps = {
    beforeUpload: async (file: File) => {
      try {
        setUploading(true);
        const fileUrl = await uploadPhoto(file);
        form.setFieldsValue({ file_path: fileUrl });
        message.success(`${file.name} 上传成功`);
        return false;
      } catch (error) {
        message.error('上传照片失败，请重试！');
        return false;
      } finally {
        setUploading(false);
      }
    },
    maxCount: 1,
  };

  // 下一步
  const nextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  // 上一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 提交注册信息
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const currentTime = dayjs().toISOString();

      const customerData: CustomerRequest = {
        customer_address: values.customer_address,
        is_verified: false,
        verifier_address: '',
        verification_time: '0001-01-01T00:00:00Z',
        registration_time: currentTime,
        role_id: 0,
        assigned_date: currentTime,
        kyc_data: {
          customer_address: values.customer_address,
          name: values.name,
          birth_date: dayjs(values.birth_date).toISOString(),
          nationality: values.nationality,
          residential_address: values.residential_address,
          phone_number: values.phone_number,
          email: values.email,
          document_type: 'ID Card',
          document_number: values.document_number,
          file_path: values.file_path,
          submission_date: currentTime,
          risk_level: 'Low',
          source_of_funds: values.source_of_funds,
          occupation: values.occupation,
        },
        kyc_verifications: [],
      };

      await registerCustomer(customerData);
      form.resetFields();
      message.success('注册成功！当前 KYC 待审批，3 个工作日内审批通过后会通知您。到时您也可以通过重新登录查看 KYC 状态。');
      navigate('/home');
    } catch (error) {
      message.error('注册失败，请稍后重试！');
    }
  };

  // 自定义日期选择限制（18岁以上）
  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current > dayjs().subtract(18, 'years').endOf('day');
  };

  // 步骤内容（移除“连接钱包”步骤）
  const steps = [
    {
      title: '基础信息',
      content: (
        <>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入您的姓名！' }]}>
            <Input placeholder="请输入您的姓名" />
          </Form.Item>
          <Form.Item name="birth_date" label="出生日期" rules={[{ required: true, message: '请选择您的出生日期！' }]}>
            <DatePicker
              style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              placeholder="请选择出生日期"
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item name="nationality" label="国籍" rules={[{ required: true, message: '请选择您的国籍！' }]}>
            <Select placeholder="请选择您的国籍">
              <Option value="CN">中国</Option>
              <Option value="US">美国</Option>
              <Option value="JP">日本</Option>
              <Option value="KR">韩国</Option>
              <Option value="GB">英国</Option>
              <Option value="FR">法国</Option>
              <Option value="DE">德国</Option>
              <Option value="AU">澳大利亚</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="residential_address"
            label="居住地址"
            rules={[{ required: true, message: '请输入您的地址！' }]}
          >
            <Input placeholder="请输入您的地址" />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="电话"
            rules={[{ required: true, pattern: /^\d{11}$/, message: '请输入有效的11位手机号码！' }]}
          >
            <Input placeholder="请输入您的电话号码" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址！' }]}>
            <Input placeholder="请输入您的邮箱" />
          </Form.Item>
          <Form.Item name="occupation" label="职业" rules={[{ required: true, message: '请选择您的职业！' }]}>
            <Select placeholder="请选择您的职业">
              <Option value="engineer">工程师</Option>
              <Option value="teacher">教师</Option>
              <Option value="doctor">医生</Option>
              <Option value="student">学生</Option>
              <Option value="business">商人</Option>
              <Option value="freelancer">自由职业者</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="source_of_funds" label="资金来源" rules={[{ required: true, message: '请选择您的资金来源！' }]}>
            <Select placeholder="请选择您的资金来源">
              <Option value="salary">工资</Option>
              <Option value="investment">投资</Option>
              <Option value="savings">储蓄</Option>
              <Option value="business">商业收入</Option>
              <Option value="inheritance">遗产</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: '证件信息',
      content: (
        <>
          <Form.Item name="customer_address" label="钱包地址" rules={[{ required: true, message: '钱包地址不可为空！' }]}>
            <Input disabled value={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''} />
          </Form.Item>
          <Form.Item name="document_number" label="证件号码" rules={[{ required: true, message: '请输入您的证件号码！' }]}>
            <Input placeholder="请输入您的证件号码" />
          </Form.Item>
          <Form.Item
            name="file_path"
            label="证件照片"
            rules={[{ required: true, message: '请上传证件照片！' }]}
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload {...uploadProps}>
              <Button
                icon={<UploadOutlined />}
                style={{
                  height: '40px',
                  fontSize: '16px',
                  background: '#fff1e6',
                  borderRadius: '8px',
                  border: '1px solid #fa8c16',
                  color: '#fa8c16',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fa8c16';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.querySelectorAll('.anticon').forEach((icon) => {
                    (icon as HTMLElement).style.color = '#fff';
                  });
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff1e6';
                  e.currentTarget.style.color = '#fa8c16';
                  e.currentTarget.querySelectorAll('.anticon').forEach((icon) => {
                    (icon as HTMLElement).style.color = '#fa8c16';
                  });
                }}
                disabled={uploading}
              >
                {uploading ? <Spin size="small" /> : '上传证件照片'}
              </Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
    {
      title: '提交',
      content: (
        <div style={{ textAlign: 'center' }}>
          <Text strong style={{ fontSize: '16px', color: '#595959', display: 'block', marginBottom: '16px' }}>
            请确认您的信息：
          </Text>
          <div
            style={{
              textAlign: 'left',
              marginBottom: '24px',
              padding: '16px',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Text strong style={{ color: '#595959' }}>基础信息</Text>
            <br />
            <Text style={{ color: '#595959' }}>姓名: {form.getFieldValue('name') || '未填写'}</Text>
            <br />
            <Text style={{ color: '#595959' }}>
              出生日期: {form.getFieldValue('birth_date') ? dayjs(form.getFieldValue('birth_date')).format('YYYY-MM-DD') : '未填写'}
            </Text>
            <br />
            <Text style={{ color: '#595959' }}>国籍: {form.getFieldValue('nationality') || '未填写'}</Text>
            <br />
            <Text style={{ color: '#595959' }}>地址: {form.getFieldValue('residential_address') || '未填写'}</Text>
            <br />
            <Text style={{ color: '#595959' }}>电话: {form.getFieldValue('phone_number') || '未填写'}</Text>
            <br />
            <Text style={{ color: '#595959' }}>邮箱: {form.getFieldValue('email') || '未填写'}</Text>
            <br />
            <Text style={{ color: '#595959' }}>职业: {form.getFieldValue('occupation') || '未填写'}</Text>
            <br />
            <Text style={{ color: '#595959' }}>资金来源: {form.getFieldValue('source_of_funds') || '未填写'}</Text>
            <br />
            <br />
            <Text strong style={{ color: '#595959' }}>证件信息</Text>
            <br />
            <Text style={{ color: '#595959' }}>钱包地址: {form.getFieldValue('customer_address') || '未连接'}</Text>
            <br />
            <Text style={{ color: '#595959' }}>证件号码: {form.getFieldValue('document_number') || '未填写'}</Text>
            <br />
            <Text style={{ color: '#595959' }}>证件照片: {form.getFieldValue('file_path') || '未上传'}</Text>
            <br />
          </div>
          <Text style={{ color: '#595959' }}>请确认您的信息无误，点击提交完成注册。</Text>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px', background: '#e6f7ff', minHeight: '100vh' }}>
      <div
        style={{
          background: 'url("https://www.pngall.com/wp-content/uploads/2016/05/White-Paper-PNG-Clipart.png") no-repeat center',
          backgroundSize: 'contain',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
        }}
      >
        <Title style={{ fontSize: '40px', color: '#ff4d4f', fontWeight: 'bold', margin: 0 }}>用户注册</Title>
      </div>
      <Row justify="center">
        <Col span={16}>
          <div
            style={{
              background: '#fffbe6',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              padding: '40px',
            }}
          >
            <Steps
              current={currentStep}
              style={{ marginBottom: '40px' }}
              items={steps.map((item) => ({ title: item.title }))}
              className="custom-steps"
            />
            <Form form={form} layout="vertical">
              {steps[currentStep].content}
            </Form>
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              {currentStep > 0 && (
                <Button
                  style={{
                    height: '50px',
                    fontSize: '16px',
                    background: '#fff1e6',
                    borderRadius: '8px',
                    border: '1px solid #fa8c16',
                    color: '#fa8c16',
                    marginRight: '16px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fa8c16';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff1e6';
                    e.currentTarget.style.color = '#fa8c16';
                  }}
                  onClick={prevStep}
                >
                  上一步
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  style={{
                    height: '50px',
                    fontSize: '16px',
                    background: '#fff1e6',
                    borderRadius: '8px',
                    border: '1px solid #fa8c16',
                    color: '#fa8c16',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fa8c16';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff1e6';
                    e.currentTarget.style.color = '#fa8c16';
                  }}
                  onClick={nextStep}
                >
                  下一步
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  style={{
                    height: '50px',
                    fontSize: '16px',
                    background: 'linear-gradient(135deg, #fa8c16, #ff7875)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ff7875, #fa8c16)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fa8c16, #ff7875)';
                  }}
                  onClick={handleSubmit}
                >
                  提交
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;