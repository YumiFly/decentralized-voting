import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Typography, Modal } from 'antd';
import { useReadContract, usePublicClient } from 'wagmi';
import VotingABI from '../contracts/VotingABI.json';
import { Poll } from '../types';

import PollList from '../components/PollList';
import CreatePollForm from '../components/CreatePollForm';
import Results from '../components/Results';

const { Title } = Typography;

const PollMain: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollIndex, setSelectedPollIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const provider = usePublicClient();

  const { data: pollCount } = useReadContract({
    address: '0xc882303b8a28e57f138d740c452879b262ef8890',
    abi: VotingABI,
    functionName: 'pollsLength',
    query: {
      enabled: true,
      staleTime: Infinity,
    },
  });

  useEffect(() => {
    //if (!hasFetched && pollCount) {
      fetchPolls();
   // }
  }, [hasFetched, pollCount]);

  const fetchPolls = async () => {
    const pollCount = 1; 
    if (!provider || !pollCount) return;
    try {
      const count = Number(pollCount.toString());
      const fetchedPolls: Poll[] = [];
      for (let i = 0; i < count; i++) {
        const pollData = await provider.readContract({
          address: '0xc882303b8a28e57f138d740c452879b262ef8890',
          abi: VotingABI,
          functionName: 'polls',
          args: [BigInt(i)],
        });
        const arrayData = parseUnknownToArray(pollData);
        if (arrayData === null) {
          throw new Error('arrayData is null');
        }
        fetchedPolls.push({
          index: i,
          title: arrayData[0],
          description: arrayData[1],
          endTime: Number(arrayData[2]),
        });
      }
      setPolls(fetchedPolls);
      setHasFetched(true);
    } catch (error) {
      console.error('Error refreshing polls:', error);
    }
  };

  const handlePollSelect = (index: number) => {
    setSelectedPollIndex(index);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  function parseUnknownToArray(data: unknown): any[] | null {
    if (Array.isArray(data)) {
      return data as any[];
    }
    return null;
  }

  const handleModalFinish = () => {
    setIsModalVisible(false);

    fetchPolls(); // Reuse the fetchPolls function
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Button type="primary" onClick={showModal}>
              创建提议
            </Button>
          </div>
          <PollList polls={polls} onSelect={handlePollSelect} />
        </Col>
        <Col span={12}>
          {selectedPollIndex !== null && <Results pollIndex={selectedPollIndex} />}
        </Col>
      </Row>
      <Modal
        title="创建提议"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        style={{ borderRadius: '4px' }}
      >
        <CreatePollForm onFinish={handleModalFinish} onCancel={handleModalCancel} />
      </Modal>
    </div>
  );
};

export default PollMain;