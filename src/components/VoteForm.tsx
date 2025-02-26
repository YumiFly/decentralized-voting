import React, { useState } from 'react';
import { Form, Radio, Button, message } from 'antd';
import { useWriteContract, useWalletClient } from 'wagmi';
import VotingABI from '../contracts/VotingABI.json';
import { useNavigate } from 'react-router-dom';

interface VoteFormProps {
  pollIndex: number;
}

const VoteForm: React.FC<VoteFormProps> = ({ pollIndex }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: walletClient } = useWalletClient();
  const { writeContract, isPending, error } = useWriteContract();

  const onFinish = async (values: any) => {
    try {
      if (!walletClient) throw new Error('Wallet not connected');
      await writeContract({
        address: '0x12...C67', // 替换为你的合约地址
        abi: VotingABI,
        functionName: 'vote', // 智能合约中的函数名
        args: [BigInt(pollIndex), BigInt(values.option)], // 确保参数类型正确
      });
      message.success('投票成功');
      form.resetFields();
      navigate('/');
    } catch (err) {
      message.error('投票失败: ' + (err as Error).message);
      console.error(err);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="option" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={0}>选项1</Radio>
          <Radio value={1}>选项2</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={isPending}>
          {isPending ? '加载中...' : '提交投票'}
        </Button>
        <Button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
          取消
        </Button>
        {error && <div style={{ color: 'red' }}>错误: {error.message}</div>}
      </Form.Item>
    </Form>
  );
};

export default VoteForm;