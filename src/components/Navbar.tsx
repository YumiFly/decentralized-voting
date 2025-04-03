import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Modal, Row, Col, Typography, Input } from 'antd';
import { useAccount, useDisconnect } from 'wagmi';
import { useLocation, useNavigate } from 'react-router-dom';
import { WalletOutlined, MailOutlined } from '@ant-design/icons';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { getCustomerById, Customer } from '../api/customer'; // 引入 getCustomerById API

const { Header } = Layout;
const { Text } = Typography;

// 默认未登录菜单
const defaultMenuItems = [
  { key: '0', label: '首页', path: '/' },
  { key: '2', label: '开奖信息', path: '/results' },
];

// Navbar 组件
const Navbar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('未登录');
  const [visibleMenus, setVisibleMenus] = useState(defaultMenuItems);
  const [selectedKey, setSelectedKey] = useState<string>('0');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [email, setEmail] = useState<string>(''); // 邮箱输入
  const [password, setPassword] = useState<string>(''); // 密码输入

  // 根据路径设置默认选中项
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = visibleMenus.find(item => item.path === currentPath);
    if (matchedItem) {
      setSelectedKey(matchedItem.key);
    } else {
      setSelectedKey('0');
    }
  }, [location.pathname, visibleMenus]);

  // 检查登录状态并获取用户数据
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isConnected && address && token && location.pathname !== '/register') {
      const fetchUserData = async () => {
        try {
          const customer: Customer = await getCustomerById(address);
          setUserRole(customer.role.role_name);
          setIsLoggedIn(true);
          const dynamicMenus = customer.role.menus
            ? customer.role.menus.map(menu => ({
                key: menu.role_menu_id.toString(),
                label: menu.menu_name,
                path: menu.menu_path,
              }))
            : [];
          setVisibleMenus(dynamicMenus.length > 0 ? dynamicMenus : defaultMenuItems);
        } catch (error) {
          message.error('获取用户信息失败，请重新登录！');
          handleLogout();
        }
      };
      fetchUserData();
    } else if (location.pathname === '/register' || !token) {
      setIsLoggedIn(false);
      setUserRole('未登录');
      setVisibleMenus(defaultMenuItems);
    }
  }, [isConnected, address, location.pathname, navigate]);

  const handleLogout = () => {
    disconnect();
    localStorage.removeItem('token');
    setUserRole('未登录');
    setIsLoggedIn(false);
    setVisibleMenus(defaultMenuItems);
    message.success('已退出登录');
    navigate('/login');
  };

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const handleWalletConnect = () => {
    open();
    setIsLoginModalVisible(false);
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      message.error('请输入邮箱和密码');
      return;
    }

    try {
      const response = await fetch('/api/login/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        const customer: Customer = await getCustomerById(email); // 假设后端支持邮箱查询
        setUserRole(customer.role.role_name);
        setIsLoggedIn(true);
        const dynamicMenus = customer.role.menus
          ? customer.role.menus.map(menu => ({
              key: menu.role_menu_id.toString(),
              label: menu.menu_name,
              path: menu.menu_path,
            }))
          : [];
        setVisibleMenus(dynamicMenus.length > 0 ? dynamicMenus : defaultMenuItems);
        setIsLoginModalVisible(false);
        message.success('邮箱登录成功');
        navigate('/');
      } else {
        message.error(data.message || '邮箱登录失败');
      }
    } catch (error) {
      message.error('登录请求失败，请检查网络或稍后重试');
    }
  };

  const handleCancelLogin = () => {
    setIsLoginModalVisible(false);
    setEmail('');
    setPassword('');
  };

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    const item = visibleMenus.find(menu => menu.key === key);
    if (item) {
      navigate(item.path);
    }
  };

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
        style={{ flex: 1, minWidth: '0', fontSize: '16px' }}
        items={visibleMenus.map(item => ({
          key: item.key,
          label: item.label,
          onClick: () => handleMenuClick(item.key),
        }))}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        {isLoggedIn ? (
          <>
            <span style={{ fontSize: '16px', color: '#000', marginRight: '10px' }}>
              {userRole} | {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <Button onClick={handleLogout} style={{ fontSize: '16px', marginLeft: '10px' }}>
              退出登录
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" onClick={showLoginModal} style={{ fontSize: '16px', marginRight: '10px' }}>
              登录
            </Button>
            <Button type="default" onClick={() => navigate('/register')} style={{ fontSize: '16px' }}>
              注册
            </Button>
          </>
        )}
      </div>

      {/* 登录选择模态框 */}
      <Modal
        open={isLoginModalVisible}
        onCancel={handleCancelLogin}
        footer={null}
        centered
        style={{ borderRadius: '5px' }}
        bodyStyle={{ background: '#fffbe6', padding: '30px', borderRadius: '5px' }}
      >
        <Text style={{ fontSize: '16px', color: '#595959', display: 'block', marginBottom: '24px', textAlign: 'center' }}>
          请连接钱包或使用邮箱登录以访问更多功能
        </Text>
        <Row gutter={[16, 16]} justify="center">
          <Col span={24}>
            <Button
              type="default"
              block
              icon={<WalletOutlined />}
              style={{
                height: '50px',
                fontSize: '16px',
                background: '#fff1e6',
                borderRadius: '8px',
                border: '1px solid #fa8c16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                color: '#fa8c16',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fa8c16';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.querySelectorAll('.anticon').forEach(icon => {
                  (icon as HTMLElement).style.color = '#fff';
                });
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff1e6';
                e.currentTarget.style.color = '#fa8c16';
                e.currentTarget.querySelectorAll('.anticon').forEach(icon => {
                  (icon as HTMLElement).style.color = '#fa8c16';
                });
              }}
              onClick={handleWalletConnect}
            >
              连接钱包
              <WalletOutlined style={{ color: '#fa8c16' }} />
            </Button>
          </Col>
          <Col span={24}>
            <div style={{ marginBottom: '16px' }}>
              <Input
                placeholder="请输入邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <Input.Password
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="primary"
              block
              onClick={handleEmailLogin}
              style={{ height: '50px', fontSize: '16px' }}
            >
              邮箱登录
            </Button>
          </Col>
        </Row>
      </Modal>
    </Header>
  );
};

export default Navbar;