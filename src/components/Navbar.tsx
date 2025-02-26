import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useAccount, useDisconnect } from 'wagmi';
import { useLocation, useNavigate } from 'react-router-dom';
const { Header } = Layout;

const Navbar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const location = useLocation(); // 获取当前 URL 路径
  const navigate = useNavigate(); // 用于导航

  // 根据当前路径动态设置 selectedKeys
  const getSelectedKeys = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return ['0']; // 首页
      case '/lottery':
        return ['1']; // 彩票购买
      case '/results':
        return ['2']; // 开奖信息
      case '/history':
        return ['3']; // 历史记录
      case '/wallet':
        return ['4']; // 钱包
      case '/governance':
        return ['5']; // 平台治理
      case '/analytics':
        return ['7']; // 数据监控与分析
      case '/settings':
        return ['8']; // 账户设置
      default:
        return ['0']; // 默认返回首页
    }
  };

  const selectedKeys = getSelectedKeys();

  return (
    <Header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1, 
      background: '#fff',
      display: 'flex', // 使用 Flexbox 布局
      alignItems: 'center', // 垂直对齐
      padding: '0 24px', // 增加内边距
      height: '64px', // 固定导航栏高度，与 Layout.Header 一致
    }}>
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        color: '#000', 
        marginRight: '16px', // 与菜单保持间距
      }}>
        去中心化彩蛋娱乐平台
      </div>
      <Menu 
        theme="light" 
        mode="horizontal" 
        selectedKeys={selectedKeys} // 动态设置选中的菜单项
        style={{ 
          flex: 1, // 让菜单自动扩展填满剩余空间
          minWidth: 0, // 防止菜单内容溢出
          fontSize: '16px', // 统一字体大小
        }}
        onClick={({ key }) => {
          switch (key) {
            case '0':
              navigate('/'); // 首页
              break;
            case '1':
              navigate('/lottery'); // 彩票购买
              break;
            case '2':
              navigate('/results'); // 开奖信息
              break;
            case '3':
              navigate('/history'); // 历史记录
              break;
            case '4':
              navigate('/wallet'); // 钱包
              break;
            case '5':
              navigate('/governance'); // 平台治理
              break;
            case '7':
              navigate('/analytics'); // 数据监控与分析
              break;
            case '8':
              navigate('/settings'); // 账户设置
              break;
            case '9':
              navigate('/polls'); // 账户设置
              break;
            default:
              navigate('/');
              break;
          }
        }}
      >
        <Menu.Item key="0">首页</Menu.Item>
        <Menu.Item key="1">彩票购买</Menu.Item>
        <Menu.Item key="2">开奖信息</Menu.Item>
        <Menu.Item key="3">历史记录</Menu.Item>
        <Menu.Item key="4">钱包</Menu.Item>
        <Menu.Item key="5">平台治理</Menu.Item>
        <Menu.Item key="7">数据监控与分析</Menu.Item>
        <Menu.Item key="8">账户设置</Menu.Item>
        <Menu.Item key="9">投票</Menu.Item>
      </Menu>
      {isConnected ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', // 垂直对齐
          marginLeft: 'auto', // 推到右侧
        }}>
          <span style={{ 
            fontSize: '16px', 
            color: '#000', 
            marginRight: '10px', // 与按钮保持间距
          }}>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <Button 
            onClick={() => disconnect()} 
            style={{ 
              fontSize: '16px', // 统一字体大小
              marginLeft: '10px', // 与文字保持间距
            }}
          >
            切换账户
          </Button>
          <Button 
            onClick={() => disconnect()} 
            style={{ 
              fontSize: '16px', // 统一字体大小
              marginLeft: '10px', // 与文字保持间距
            }}
          >
            登出
          </Button>
        </div>
      ) : null}
    </Header>
  );
};

export default Navbar;