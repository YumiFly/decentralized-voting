import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Modal, Row, Col, Typography, message, Dropdown } from 'antd';
import { useAccount, useDisconnect } from 'wagmi';
import { useLocation, useNavigate } from 'react-router-dom';
import { WalletOutlined, MailOutlined, DownOutlined } from '@ant-design/icons';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Text } = Typography;

// 菜单项定义
const menuItems = [
  { key: '0', label: '首页', path: '/' },
  { key: '6', label: '彩票管理', path: '/lottery-management' }, // 彩票发行人专属
  { key: '1', label: '彩票购买', path: '/lottery' },
  { key: '4', label: '钱包', path: '/wallet' },
  { key: '7', label: '数据监控与分析', path: '/analytics' },
  { key: '2', label: '开奖信息', path: '/results' },
  { key: '3', label: '历史记录', path: '/history' },
  { key: '5', label: '平台治理', path: '/governance' },
  { key: '8', label: '账户设置', path: '/settings' },
  { key: '9', label: '投票', path: '/polls' }, // 管理员专属
];

type Role = 'unlogged' | 'user' | 'issuer' | 'admin';

// 权限控制函数
const getVisibleMenuItems = (role: Role) => {
  const roleMap: Record<Role, string[]> = {
    unlogged: ['0', '2'], // 未登录：首页、开奖信息
    user: ['0', '1', '2', '3', '4', '8'], // 普通用户：首页、彩票购买、开奖信息、历史记录、钱包、账户设置
    issuer: ['0', '1', '2', '3', '4', '6', '7', '8'], // 彩票发行人：首页、彩票购买、彩票管理、开奖信息、历史记录、数据监控、钱包、账户设置
    admin: menuItems.map(item => item.key), // 管理员：所有页面
  };
  return menuItems.filter(item => roleMap[role].includes(item.key));
};

// Navbar 组件
const Navbar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [phoneLogin, setPhoneLogin] = useState<string | null>(localStorage.getItem('phoneLogin'));
  const [userRole, setUserRole] = useState<Role>('unlogged'); // Mock 用户角色
  const [selectedKey, setSelectedKey] = useState<string>('0'); // 当前选中的菜单项 key

  // 根据路径设置默认选中项
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = menuItems.find(item => item.path === currentPath);
    if (matchedItem) {
      setSelectedKey(matchedItem.key);
    } else {
      setSelectedKey('0'); // 默认选中首页
    }
  }, [location.pathname]);

  // 切换用户角色（用于测试）
  const switchRole = (role: Role) => {
    setUserRole(role);
    if (role === 'unlogged') {
      disconnect();
      localStorage.removeItem('phoneLogin');
      setPhoneLogin(null);
    } else {
      localStorage.setItem('phoneLogin', '12345678901'); // Mock 登录
    }
    message.success(`切换到 ${role === 'unlogged' ? '未登录' : role} 角色`);
  };

  const handleLogout = () => {
    disconnect();
    localStorage.removeItem('phoneLogin');
    setPhoneLogin(null);
    setUserRole('unlogged');
    message.success('已退出登录');
  };

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const handleWalletConnect = () => {
    open();
    setIsLoginModalVisible(false);
  };

  const handlePhoneLogin = () => {
    const phone = prompt('请输入手机号码：');
    if (phone && /^\d{11}$/.test(phone)) {
      localStorage.setItem('phoneLogin', phone);
      setPhoneLogin(phone);
      // Mock 登录后随机分配角色（测试用）
      const roles = ['user', 'issuer', 'admin'] as const;
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      setUserRole(randomRole);
      setIsLoginModalVisible(false);
      message.success(`手机登录成功，角色分配为：${randomRole}`);
    } else {
      message.error('请输入有效的11位手机号码');
    }
  };

  const handleCancelLogin = () => {
    setIsLoginModalVisible(false);
  };

  // 点击菜单项时更新 selectedKey 并跳转
  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    const item = menuItems.find(menu => menu.key === key);
    if (item) {
      navigate(item.path);
    }
  };

  // 下拉菜单项
  const roleMenuItems: MenuProps['items'] = [
    { key: 'unlogged', label: '未登录', onClick: () => switchRole('unlogged') },
    { key: 'user', label: '普通用户', onClick: () => switchRole('user') },
    { key: 'issuer', label: '彩票发行人', onClick: () => switchRole('issuer') },
    { key: 'admin', label: '管理员', onClick: () => switchRole('admin') },
  ];

  const visibleMenuItems = getVisibleMenuItems(userRole);

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        height: '64px',
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#000',
          marginRight: '16px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '30px' }}>彩</span>
        <span>蛋娱乐</span>
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[selectedKey]} // 使用 selectedKey 控制高亮
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: '16px',
        }}
        items={visibleMenuItems.map(item => ({
          key: item.key,
          label: item.label,
          onClick: () => handleMenuClick(item.key), // 点击时更新 selectedKey 并跳转
        }))}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        {/* 角色切换下拉菜单 */}
        <Dropdown menu={{ items: roleMenuItems }} trigger={['click']}>
          <Button style={{ marginRight: '10px' }}>
            {userRole === 'unlogged' ? '未登录' : userRole} <DownOutlined />
          </Button>
        </Dropdown>
        {isConnected || phoneLogin ? (
          <>
            <span style={{ fontSize: '16px', color: '#000', marginRight: '10px' }}>
              {isConnected
                ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                : `用户: ${phoneLogin}`}
            </span>
            <Button
              onClick={handleLogout}
              style={{ fontSize: '16px', marginLeft: '10px' }}
            >
              退出登录
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            onClick={showLoginModal}
            style={{ fontSize: '16px' }}
          >
            登录
          </Button>
        )}
      </div>

      {/* 登录选择模态框 */}
      <Modal
        title="Welcome to 彩蛋娱乐"
        open={isLoginModalVisible}
        onCancel={handleCancelLogin}
        footer={null}
        centered
        style={{ borderRadius: '8px' }}
        bodyStyle={{ background: '#f5f5f5', padding: '20px' }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button
              type="default"
              block
              icon={<WalletOutlined />}
              style={{
                height: '50px',
                fontSize: '16px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onClick={handleWalletConnect}
            >
              Connect Wallet
              <WalletOutlined />
            </Button>
          </Col>
          <Col span={24}>
            <Button
              type="default"
              block
              icon={<MailOutlined />}
              style={{
                height: '50px',
                fontSize: '16px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onClick={handlePhoneLogin}
            >
              Email Login
              <MailOutlined />
            </Button>
          </Col>
        </Row>
      </Modal>
    </Header>
  );
};

export default Navbar;