import axios from 'axios';

// 设置后端 API 的基础 URL（根据你的后端地址调整）
const BASE_URL = 'http://localhost:8080/';

// 定义接口返回的数据类型
export interface LotteryType {
  type_id: string;
  type_name: string;
  description: string;
}

export interface Lottery {
  lottery_id: string;
  ticket_name: string;
  betting_rules: string;
  ticket_price: string;
  prize_structure: string;
}

export interface LotteryIssue {
  issue_id: string;
  lottery_id: string;
  issue_number: string;
  sale_end_time: string;
  draw_time: string;
  prize_pool: string;
  winning_numbers: string[];
}

export interface DrawResult {
  lottery: string;
  issue: string;
  numbers: string[];
  date: string;
}

// 获取彩票类型
export const fetchLotteryTypes = async (): Promise<LotteryType[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/lottery/types`);
    return response.data;
  } catch (error) {
    console.error('获取彩票分类失败:', error);
    throw error;
  }
};

// 获取彩票基本信息
export const fetchLotteries = async (): Promise<Lottery[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/lottery/lottery`);
    return response.data;
  } catch (error) {
    console.error('获取彩票类型失败:', error);
    throw error;
  }
};

// 获取彩票期号信息
export const fetchLotteryIssues = async (): Promise<LotteryIssue[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/lottery/issue`);
    return response.data;
  } catch (error) {
    console.error('获取彩票期号失败:', error);
    throw error;
  }
}

// 获取奖池金额，所有快到期的期数的奖池数据只和
export const fetchPrizePool = async (): Promise<number> => {
  try {
    const response = await axios.get(`${BASE_URL}/lottery/pools`);
    return response.data;
  } catch (error) {
    console.error('获取奖池金额失败:', error);
    throw error;
  }
};

// 获取即将开奖的彩票期数以及信息
export const fetchUpcomingIssues = async (): Promise<LotteryIssue[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/lottery/upcoming-issues`);
    return response.data;
  } catch (error) {
    console.error('获取快开奖的彩票期数失败:', error);
    throw error;
  }
}

// 获取最近开奖信息
export const fetchDrawResults = async (): Promise<DrawResult[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/lottery/draw-results`);
    return response.data;
  } catch (error) {
    console.error('获取最近开奖信息失败:', error);
    throw error;
  }
};