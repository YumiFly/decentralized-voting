import React, { useState } from 'react';
import { Row, Col, Typography, Card, Table, Button, message, Modal, Form, Input, InputNumber } from 'antd';
import { useAccount } from 'wagmi';

const { Title, Text } = Typography;

interface NFTCertificate {
  key: string;
  id: number;
  lotteryType: string;
  numbers: string;
  purchaseTime: string;
  status: string;
  transactionHash?: string;
}

const Wallet: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<number>(1000); // Mock 余额
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTCertificate | null>(null);
  const [withdrawForm] = Form.useForm();
  const [transferForm] = Form.useForm();

  const nftCertificates: NFTCertificate[] = [
    { key: '1', id: 1, lotteryType: '双色球', numbers: '3, 12, 17, 23, 28, 32 + 7', purchaseTime: '2025-03-13 10:00:00', status: '有效', transactionHash: '0x123abc' },
    { key: '2', id: 2, lotteryType: '七乐彩', numbers: '4, 9, 15, 18, 22, 26, 29', purchaseTime: '2025-03-12 15:30:00', status: '已开奖', transactionHash: '0x456def' },
    { key: '3', id: 3, lotteryType: '3D', numbers: '479', purchaseTime: '2025-03-11 09:00:00', status: '已兑奖', transactionHash: '0x789ghi' },
  ];

  const columns = [
    { title: '凭证 ID', dataIndex: 'id', key: 'id' },
    { title: '彩票类型', dataIndex: 'lotteryType', key: 'lotteryType' },
    { title: '号码', dataIndex: 'numbers', key: 'numbers' },
    { title: '购买时间', dataIndex: 'purchaseTime', key: 'purchaseTime' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: NFTCertificate) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            onClick={() => {
              setSelectedNFT(record);
              setIsDetailModalVisible(true);
            }}
            style={{ borderRadius: '8px', background: '#ff4d4f', borderColor: '#ff4d4f', color: '#fff' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ff7875')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ff4d4f')}
          >
            查看详情
          </Button>
          <Button
            disabled={record.status !== '有效'} // 只有“有效”状态的 NFT 可以转存
            onClick={() => {
              setSelectedNFT(record);
              setIsTransferModalVisible(true);
            }}
            style={{ borderRadius: '8px', background: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#40a9ff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#1890ff')}
          >
            转存
          </Button>
        </div>
      ),
    },
  ];

  // 提现操作
  const handleWithdraw = (values: any) => {
    const amount = values.amount;
    if (amount > balance) {
      message.error('余额不足！');
      return;
    }
    setBalance((prev) => prev - amount);
    message.success(`成功提现 ${amount} USDT！`);
    setIsWithdrawModalVisible(false);
    withdrawForm.resetFields();
  };

  // 转存操作
  const handleTransfer = (values: any) => {
    const targetAddress = values.targetAddress;
    if (!targetAddress || !/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
      message.error('请输入有效的钱包地址！');
      return;
    }
    message.success(`NFT 凭证 ${selectedNFT?.id} 已转存到 ${targetAddress}！`);
    setIsTransferModalVisible(false);
    transferForm.resetFields();
  };

  return (
    <div style={{ padding: '40px', background: '#e6f7ff' }}>
      <Row gutter={32}>
        <Col span={8}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>钱包信息</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            <Text style={{ color: '#fff', fontSize: '16px' }}>
              钱包地址：{isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : '未连接'}
            </Text>
            <br />
            <Text style={{ color: '#fff', fontSize: '16px', marginTop: '16px' }}>
              余额：{balance} USDT
            </Text>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <Button
                style={{
                  width: '100%',
                  background: '#ffd700',
                  borderColor: '#ffd700',
                  color: '#fff',
                  borderRadius: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffaa00')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ffd700')}
                onClick={() => message.info('充值功能开发中...')}
              >
                充值
              </Button>
              <Button
                disabled={!isConnected}
                style={{
                  width: '100%',
                  background: '#1890ff',
                  borderColor: '#1890ff',
                  color: '#fff',
                  borderRadius: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#40a9ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1890ff')}
                onClick={() => setIsWithdrawModalVisible(true)}
              >
                提现
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={16}>
          <Card
            title={<Text strong style={{ color: '#fff' }}>NFT 凭证</Text>}
            bordered={false}
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}
          >
            <Table
              columns={columns}
              dataSource={nftCertificates}
              pagination={{ pageSize: 5 }}
              style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 提现模态框 */}
      <Modal
        title={<Text strong style={{ color: '#ff4d4f' }}>提现</Text>}
        open={isWithdrawModalVisible}
        onCancel={() => {
          setIsWithdrawModalVisible(false);
          withdrawForm.resetFields();
        }}
        footer={null}
        centered
        bodyStyle={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}
      >
        <Form form={withdrawForm} onFinish={handleWithdraw} layout="vertical">
          <Form.Item
            label={<Text strong>提现金额 (USDT)</Text>}
            name="amount"
            rules={[{ required: true, message: '请输入提现金额！' }, { type: 'number', min: 1, message: '金额必须大于0！' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} addonAfter="USDT" />
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
              确认提现
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* NFT 详情模态框 */}
      <Modal
        title={<Text strong style={{ color: '#ff4d4f' }}>NFT 凭证详情</Text>}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}
      >
        {selectedNFT && (
          <div>
            <Text style={{ color: '#000', fontSize: '16px' }}>
              <strong>凭证 ID：</strong>{selectedNFT.id}
            </Text>
            <br />
            <Text style={{ color: '#000', fontSize: '16px' }}>
              <strong>彩票类型：</strong>{selectedNFT.lotteryType}
            </Text>
            <br />
            <Text style={{ color: '#000', fontSize: '16px' }}>
              <strong>号码：</strong>{selectedNFT.numbers}
            </Text>
            <br />
            <Text style={{ color: '#000', fontSize: '16px' }}>
              <strong>购买时间：</strong>{selectedNFT.purchaseTime}
            </Text>
            <br />
            <Text style={{ color: '#000', fontSize: '16px' }}>
              <strong>状态：</strong>{selectedNFT.status}
            </Text>
            <br />
            <Text style={{ color: '#000', fontSize: '16px' }}>
              <strong>交易哈希：</strong>{selectedNFT.transactionHash || '无'}
            </Text>
          </div>
        )}
      </Modal>

      {/* NFT 转存模态框 */}
      <Modal
        title={<Text strong style={{ color: '#ff4d4f' }}>转存 NFT 凭证</Text>}
        open={isTransferModalVisible}
        onCancel={() => {
          setIsTransferModalVisible(false);
          transferForm.resetFields();
        }}
        footer={null}
        centered
        bodyStyle={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}
      >
        <Form form={transferForm} onFinish={handleTransfer} layout="vertical">
          <Form.Item
            label={<Text strong>目标地址</Text>}
            name="targetAddress"
            rules={[{ required: true, message: '请输入目标地址！' }]}
          >
            <Input placeholder="请输入目标钱包地址（0x...）" />
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
              确认转存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Wallet;