import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, ConfigProvider, Typography } from 'antd';
import Home from './pages/Home';
import PollDetail from './pages/PollDetail';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PollMain from './pages/PollMain';
import LotteryManagement from './pages/LotteryManagement';
import Lottery from './pages/Lottery';
import Results from './pages/Results';
import History from './pages/History';
import Governance from './pages/Governance';
import Wallet from './pages/Wallet';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

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
              <Route path="/" element={<Home />} />
              <Route path="/poll/:pollIndex" element={<PollDetail />} />
              <Route path="/lottery" element={<Lottery />} />
              <Route path="/results" element={<Results />} />
              <Route path="/history" element={<History />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/lottery-management" element={<LotteryManagement />} />
             <Route path="/polls" element={<PollMain />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
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

export default App;