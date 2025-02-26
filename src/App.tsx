import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, Typography } from 'antd';
import Home from './pages/Home';
import PollDetail from './pages/PollDetail';
import Navbar from './components/Navbar';
import Login from './components/Login'; 
import PollMain from './pages/PollMain';// 新增登录组件
import Lottery from './pages/Lottery';
import Results from './pages/Results';
import History from './pages/History';
import Governance from './pages/Governance';
import Wallet from './pages/Wallet';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { useAccount } from 'wagmi';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function App() {
  return (
    <ConfigProvider>
      <Router>
        <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
          <Header style={{ position: 'sticky', top: 0, zIndex: 1, background: '#fff', padding: '0 24px' }}>
            <Navbar />
          </Header>
          <Content style={{ padding: '20px', flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/poll/:pollIndex" element={<ProtectedRoute><PollDetail /></ProtectedRoute>} />
              {/* 未来扩展的路由占位 */}
              <Route path="/lottery" element={<ProtectedRoute><Lottery/></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><Results/></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History/></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet/></ProtectedRoute>} />
              <Route path="/governance" element={<ProtectedRoute><Governance/></ProtectedRoute>} />
              <Route path="/polls" element={<ProtectedRoute><PollMain/></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center', backgroundColor: '#fafafa', padding: '10px 0' }}>
            <Text>© 2025 去中心化彩蛋娱乐平台 保留所有权利</Text>
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

// 保护路由，只有连接钱包后才能访问
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount(); // 从 wagmi 导入 useAccount
  if (!isConnected) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default App;