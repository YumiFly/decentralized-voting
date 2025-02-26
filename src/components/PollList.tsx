import React from 'react';
import { Card, List, Typography } from 'antd';
import { Poll } from '../types';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface PollListProps {
  polls: Poll[];
  onSelect?: (index: number) => void;
}

const PollList: React.FC<PollListProps> = ({ polls, onSelect }) => {
  const navigate = useNavigate();

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={polls}
      renderItem={(poll) => (
        <List.Item>
          <Card
            title={poll.title}
            extra={<span>{new Date(poll.endTime * 1000).toLocaleString()}</span>}
            onClick={() => {
              if (onSelect) {
                onSelect(poll.index);
              }
              navigate(`/poll/${poll.index}`);
            }}
            style={{
              cursor: 'pointer',
              border: '1px solid #d9d9d9', // 与设计图一致的边框
              borderRadius: '4px', // 圆角与设计图一致
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // 添加阴影，与设计图卡片样式一致
            }}
          >
            <Typography.Paragraph ellipsis={{ rows: 2 }}>{poll.description}</Typography.Paragraph>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default PollList;