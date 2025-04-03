import api from './config';

// 登录返回的数据类型
export interface LoginResponse {
  message: string;
  code: number;
  data: {
    customer_address: string;
    role: string;
    menus: { role_menu_id: number; role_id: number; menu_name: string; menu_path: string }[];
    token: string;
  };
}

// 用户登录
export const login = async (wallet_address: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/login', { wallet_address });
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// KYC 验证请求的数据类型
export interface KycVerificationRequest {
  history_id: number;
  customer_address: string;
  verify_status: string;
  verifier_address: string;
  verification_date: string;
  comments: string;
}

// KYC 验证
export const verifyKyc = async (verificationData: KycVerificationRequest): Promise<void> => {
  try {
    await api.post('/auth/verify', verificationData);
  } catch (error) {
    console.error('KYC验证失败:', error);
    throw error;
  }
};