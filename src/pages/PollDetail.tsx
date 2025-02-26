import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button } from 'antd';
import VoteForm from '../components/VoteForm';
import Results from '../components/Results';
import { useReadContract, usePublicClient, useWalletClient } from 'wagmi';
import VotingABI from '../contracts/VotingABI.json';
import { Poll } from '../types';

const { Title } = Typography;

const PollDetail: React.FC = () => {
  const [hasVoted, setHasVoted] = useState<boolean | null>(null);
  const { pollIndex } = useParams<{ pollIndex: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const provider = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { data: pollData, error } = useReadContract({
    address: '0x12...C67', // 替换为你的合约地址
    abi: VotingABI,
    functionName: 'polls', // 假设合约有 polls 方法
    args: [BigInt(pollIndex || '0')],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoteStatus = async () => {
      const voted = await checkIfVoted();
      setHasVoted(voted);
    };
    fetchVoteStatus();
    if (pollData) {
      const data = pollData as unknown as Poll; // Use type assertion
      setPoll({
        index: Number(pollIndex),
        title: data.title, // 假设 title 是第一个返回字段
        description: data.description, // 假设 description 是第二个返回字段
        endTime: Number(data.endTime), // 假设 endTime 是第三个返回字段
      });
    }
  }, [pollData, pollIndex]);

  if (!poll) return <div>Loading...</div>;

  const checkIfVoted = async () => {
    if (!walletClient || !pollIndex) return false;
    const address = await walletClient.getAddresses(); // 获取当前地址
    // 这里需要根据你的合约实现检查是否已投票（可能需要自定义合约函数）
    return false; // 模拟未投票
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>
        <Title level={2}>{poll.title}</Title>
        <p>{poll.description}</p>
        <p>结束时间: {new Date(poll.endTime * 1000).toLocaleString()}</p>
        {Date.now() / 1000 < poll.endTime ? (
        hasVoted ? (
        <Button onClick={() => navigate('/')} disabled>
          已投票
        </Button>
      ) : (
        <VoteForm pollIndex={poll.index} />
      )
    ) : (
      <Results pollIndex={poll.index} />
    )}
      </Card>
    </div>
  );
};

export default PollDetail;