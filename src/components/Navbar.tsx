import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, message } from 'antd';
import { useAccount, useDisconnect } from 'wagmi';
import { useLocation, useNavigate } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header } = Layout;

// 菜单项定义
const menuItems = [
  { key: '0', label: '首页', path: '/' },
  { key: '6', label: '彩票管理', path: '/lottery-management' },
  { key: '1', label: '彩票购买', path: '/lottery' },
  { key: '4', label: '钱包', path: '/wallet' },
  { key: '7', label: '数据监控与分析', path: '/analytics' },
  { key: '2', label: '开奖信息', path: '/results' },
  { key: '3', label: '历史记录', path: '/history' },
  { key: '5', label: '平台治理', path: '/governance' },
  { key: '8', label: '账户设置', path: '/settings' },
  { key: '9', label: '投票', path: '/polls' },
];

type Role = 'unlogged' | 'user' | 'issuer' | 'admin';

// 权限控制函数
const getVisibleMenuItems = (role: Role) => {
  const roleMap: Record<Role, string[]> = {
    unlogged: ['0', '2'],
    user: ['0', '1', '2', '3', '4', '8'],
    issuer: ['0', '1', '2', '3', '4', '6', '7', '8'],
    admin: menuItems.map(item => item.key),
  };
  return menuItems.filter(item => roleMap[role].includes(item.key));
};

// Navbar 组件
const Navbar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<Role>('unlogged');
  const [selectedKey, setSelectedKey] = useState<string>('0');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 新增状态控制登录显示

  // 根据路径设置默认选中项
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = menuItems.find(item => item.path === currentPath);
    if (matchedItem) {
      setSelectedKey(matchedItem.key);
    } else {
      setSelectedKey('0');
    }
  }, [location.pathname]);

  // 检查登录状态
  useEffect(() => {
    // 仅在非注册页面（/register）时更新登录状态
    if (location.pathname !== '/register') {
      const phoneLogin = localStorage.getItem('phoneLogin');
      setIsLoggedIn(isConnected || !!phoneLogin);
    } else {
      // 在注册页面时，强制不显示登录状态
      setIsLoggedIn(false);
    }
  }, [isConnected, location.pathname]);

  // 切换用户角色（用于测试）
  const switchRole = (role: Role) => {
    setUserRole(role);
    if (role === 'unlogged') {
      disconnect();
      localStorage.removeItem('phoneLogin');
    } else {
      localStorage.setItem('phoneLogin', '12345678901');
    }
    message.success(`切换到 ${role === 'unlogged' ? '未登录' : role} 角色`);
  };

  const handleLogout = () => {
    disconnect();
    localStorage.removeItem('phoneLogin');
    setUserRole('unlogged');
    setIsLoggedIn(false);
    message.success('已退出登录');
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
        selectedKeys={[selectedKey]}
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: '16px',
        }}
        items={visibleMenuItems.map(item => ({
          key: item.key,
          label: item.label,
          onClick: () => handleMenuClick(item.key),
        }))}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <Dropdown menu={{ items: roleMenuItems }} trigger={['click']}>
          <Button style={{ marginRight: '10px' }}>
            {userRole === 'unlogged' ? '未登录' : userRole} <DownOutlined />
          </Button>
        </Dropdown>
        {isLoggedIn ? (
          <>
            <span style={{ fontSize: '16px', color: '#000', marginRight: '10px' }}>
              {isConnected
                ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                : `用户: ${localStorage.getItem('phoneLogin')}`}
            </span>
            <Button
              onClick={handleLogout}
              style={{ fontSize: '16px', marginLeft: '10px' }}
            >
              退出登录
            </Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              onClick={() => navigate('/login')}
              style={{ fontSize: '16px', marginRight: '10px' }}
            >
              登录
            </Button>
            <Button
              type="default"
              onClick={() => navigate('/register')}
              style={{ fontSize: '16px' }}
            >
              注册
            </Button>
          </>
        )}
      </div>
    </Header>
  );
};

export default Navbar;