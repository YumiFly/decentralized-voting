import axios from 'axios';

// 设置后端 API 的基础 URL（根据你的后端地址调整）
const BASE_URL = 'http://localhost:8080';

// 定义 KYC 数据类型
export interface KycData {
  customer_address: string;
  name: string;
  birth_date: string;
  nationality: string;
  residential_address: string;
  phone_number: string;
  email: string;
  document_type: string;
  document_number: string;
  file_path: string;
  submission_date: string;
  risk_level: string;
  source_of_funds: string;
  occupation: string;
}

// 定义用户注册请求的数据类型
export interface CustomerRequest {
  customer_address: string;
  is_verified: boolean;
  verifier_address: string;
  verification_time: string;
  registration_time: string;
  role_id: number;
  assigned_date: string;
  kyc_data: KycData;
  kyc_verifications: any[];
}

// 上传照片
export const uploadPhoto = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('idPhoto', file);
    const response = await axios.post(`${BASE_URL}/customer/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.file_url;
  } catch (error) {
    console.error('上传照片失败:', error);
    throw error;
  }
};

// 提交用户注册信息
export const registerCustomer = async (customerData: CustomerRequest): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/customers`, customerData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('注册用户失败:', error);
    throw error;
  }
};