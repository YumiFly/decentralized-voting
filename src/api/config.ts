import axios from 'axios';

// 设置后端 API 的基础 URL
export const BASE_URL = 'http://localhost:8080';

// 创建 axios 实例，添加默认配置
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器（例如添加 token）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;