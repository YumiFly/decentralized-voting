import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { useWriteContract, useWalletClient,useAccount } from 'wagmi';
import VotingABI from '../contracts/VotingABI.json';

interface CreatePollFormProps {
  onFinish: (values: any) => void;
  onCancel: () => void;
}

const CreatePollForm: React.FC<CreatePollFormProps> = ({ onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();

  const handleFinish = async (values: any) => {
    try {
      if (!walletClient) throw new Error('Wallet not connected');
      const endTime = Math.floor(new Date(values.endTime).getTime() / 1000);

      await writeContract({
        address: '0xc882303b8a28e57f138d740c452879b262ef8890', // 替换为你的合约地址
        abi: VotingABI,
        functionName: 'createPoll', // 智能合约中的函数名
        args: [values.title, values.description, BigInt(endTime)], // 确保参数类型正确
      });

      message.success('投票创建成功');
      form.resetFields();
      onFinish(values); // 回调通知父组件
    } catch (err) {
      message.error('创建投票失败: ' + (err as Error).message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item name="title" label="标题" rules={[{ required: true }]}>
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item name="description" label="描述" rules={[{ required: true }]}>
        <Input.TextArea placeholder="请输入描述" />
      </Form.Item>
      <Form.Item name="option1" label="选项1" rules={[{ required: true }]}>
        <Input placeholder="请输入选项1" />
      </Form.Item>
      <Form.Item name="option2" label="选项2" rules={[{ required: true }]}>
        <Input placeholder="请输入选项2" />
      </Form.Item>
      <Form.Item name="option3" label="选项3" rules={[{ required: true }]}>
        <Input placeholder="请输入选项3" />
      </Form.Item>
      <Form.Item name="endTime" label="结束时间" rules={[{ required: true }]}>
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" htmlType="submit" disabled={isPending}>
            {isPending ? '加载中...' : '提交'}
          </Button>
          <Button onClick={onCancel}>取消</Button>
          {error && <div style={{ color: 'red', marginLeft: '8px' }}>错误: {error.message}</div>}
        </div>
      </Form.Item>
    </Form>
    </div>
  );
};

export default CreatePollForm;