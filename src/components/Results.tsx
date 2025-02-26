import React, { useEffect, useState } from 'react';
import { Statistic, Row, Col, Typography, Button } from 'antd';
import { useReadContract } from 'wagmi';
import VotingABI from '../contracts/VotingABI.json';

const { Title } = Typography;

interface ResultsProps {
  pollIndex: number;
}

const Results: React.FC<ResultsProps> = ({ pollIndex }) => {
  const [results, setResults] = useState<number[]>([]);
  const { data: pollResults, error } = useReadContract({
    address: '0x12...C67', // 替换为你的合约地址
    abi: VotingABI,
    functionName: 'getPollResults', // 智能合约中的函数名
    args: [BigInt(pollIndex)],
  });

  useEffect(() => {
    if (pollResults) {
      // 确保 pollResults 是数组，并转换为数字数组
      if (Array.isArray(pollResults)) {
        setResults(pollResults.map((r: bigint) => Number(r)));
      } else {
        setResults([]); // 默认空数组
      }
    } else {
      setResults([]); // 如果 pollResults 为 undefined 或 null，默认空数组
    }
  }, [pollResults]);

  const totalVotes = results.reduce((sum, count) => sum + count, 0);
  const option1Votes = results[0] || 0;
  const option2Votes = results[1] || 0;
  const option1Percentage = totalVotes ? ((option1Votes / totalVotes) * 100).toFixed(0) : '0';
  const option2Percentage = totalVotes ? ((option2Votes / totalVotes) * 100).toFixed(0) : '0';

  return (
    <div>
      <Title level={3}>投票结果</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="选项1" value={option1Votes} suffix={`(${option1Percentage}%)`} />
        </Col>
        <Col span={12}>
          <Statistic title="选项2" value={option2Votes} suffix={`(${option2Percentage}%)`} />
        </Col>
      </Row>
      <Button onClick={() => window.location.href = '/'}>返回主界面</Button>
      {error && <div style={{ color: 'red' }}>错误: {error.message}</div>}
    </div>
  );
};

export default Results;