import axios from 'axios';

// API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

// 创建axios实例
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取占卜解读
export const getDivinationInterpretation = async (
  matter: string, 
  hexagram: string, 
  lines: string[]
) => {
  try {
    const response = await api.post('/divination/interpret', {
      matter,
      hexagram,
      lines
    });
    return response.data;
  } catch (error) {
    console.error('获取占卜解读失败:', error);
    throw error;
  }
};

// 获取占卜历史记录
export const getDivinationHistory = async () => {
  try {
    const response = await api.get('/divinations');
    return response.data;
  } catch (error) {
    console.error('获取占卜历史记录失败:', error);
    throw error;
  }
};

// 生成卦象
export const generateHexagram = async (matter: string) => {
  try {
    const response = await api.post('/divination/generate', {
      matter
    });
    return response.data;
  } catch (error) {
    console.error('生成卦象失败:', error);
    throw error;
  }
};

// 获取占卜结果
export const getDivinationResult = async (id: string) => {
  try {
    const response = await api.get(`/divination/result/${id}`);
    return response.data;
  } catch (error) {
    console.error('获取占卜结果失败:', error);
    throw error;
  }
}; 