'use client';

import { useState } from 'react';
import styled from '@emotion/styled';

const FortuneContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const FortuneHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const FortuneCard = styled.div`
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DateSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const DateButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#4CAF50' : 'transparent'};
  color: ${props => props.active ? 'white' : 'black'};
  border: 1px solid #4CAF50;
  border-radius: 20px;
  padding: 8px 15px;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)'};
  }
`;

const CategoryTitle = styled.h3`
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
`;

const FortuneText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #555;
`;

const LuckyNumbers = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const LuckyNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #FF9500;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const GenerateButton = styled.button`
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
  }
`;

type FortuneType = 'today' | 'tomorrow' | 'week' | 'month';

interface FortuneData {
  overall: string;
  love: string;
  career: string;
  wealth: string;
  health: string;
  luckyNumbers: number[];
}

export default function FortunePage() {
  const [activeType, setActiveType] = useState<FortuneType>('today');
  const [fortune, setFortune] = useState<FortuneData>({
    overall: '今天整体运势不错，可以尝试新事物。',
    love: '单身的人可能会有意外的邂逅，已有伴侣的人感情稳定。',
    career: '工作上会有小困难，但通过自己的努力能够克服。',
    wealth: '财运平稳，避免冲动消费。',
    health: '注意休息，避免过度劳累。',
    luckyNumbers: [7, 15, 23, 31, 42, 56]
  });

  const generateFortune = () => {
    // 模拟生成新的运势数据
    const overallOptions = [
      '今天整体运势很好，适合大胆尝试。',
      '今天运势平平，宜静不宜动。',
      '今天运势不错，保持平常心。',
      '今天可能会有小波折，但不影响整体。',
      '今天运势极佳，可以放手一搏。'
    ];
    
    const loveOptions = [
      '感情上可能会有突破性进展。',
      '感情稳定，可以进行一些小惊喜。',
      '单身的人可能会遇到心动的对象。',
      '已有伴侣的人需要多一些沟通。',
      '今天适合与伴侣共度浪漫时光。'
    ];
    
    const careerOptions = [
      '工作上会有新的机会，要把握住。',
      '职场上可能会遇到一些挑战，保持冷静。',
      '今天适合处理创意性的工作。',
      '工作效率高，可以完成不少任务。',
      '可能会收到上级的肯定和赞赏。'
    ];
    
    const wealthOptions = [
      '财运不错，可能会有意外收获。',
      '理财方面需要谨慎，避免冲动投资。',
      '适合进行长期投资规划。',
      '可能会有一笔额外收入。',
      '财务状况稳定，可以适当享受生活。'
    ];
    
    const healthOptions = [
      '身体状况良好，保持运动习惯。',
      '可能会感到有些疲惫，注意休息。',
      '饮食方面需要注意均衡。',
      '心情愉快，对健康有益。',
      '适合进行户外活动，呼吸新鲜空气。'
    ];
    
    // 随机生成幸运数字
    const newLuckyNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 60) + 1);
    
    setFortune({
      overall: overallOptions[Math.floor(Math.random() * overallOptions.length)],
      love: loveOptions[Math.floor(Math.random() * loveOptions.length)],
      career: careerOptions[Math.floor(Math.random() * careerOptions.length)],
      wealth: wealthOptions[Math.floor(Math.random() * wealthOptions.length)],
      health: healthOptions[Math.floor(Math.random() * healthOptions.length)],
      luckyNumbers: newLuckyNumbers
    });
  };

  return (
    <FortuneContainer>
      <FortuneHeader>运势分析</FortuneHeader>
      
      <DateSelector>
        <DateButton 
          active={activeType === 'today'} 
          onClick={() => setActiveType('today')}
        >
          今日
        </DateButton>
        <DateButton 
          active={activeType === 'tomorrow'} 
          onClick={() => setActiveType('tomorrow')}
        >
          明日
        </DateButton>
        <DateButton 
          active={activeType === 'week'} 
          onClick={() => setActiveType('week')}
        >
          本周
        </DateButton>
        <DateButton 
          active={activeType === 'month'} 
          onClick={() => setActiveType('month')}
        >
          本月
        </DateButton>
      </DateSelector>
      
      <FortuneCard>
        <CategoryTitle>整体运势</CategoryTitle>
        <FortuneText>{fortune.overall}</FortuneText>
        
        <CategoryTitle>爱情运势</CategoryTitle>
        <FortuneText>{fortune.love}</FortuneText>
        
        <CategoryTitle>事业运势</CategoryTitle>
        <FortuneText>{fortune.career}</FortuneText>
        
        <CategoryTitle>财富运势</CategoryTitle>
        <FortuneText>{fortune.wealth}</FortuneText>
        
        <CategoryTitle>健康运势</CategoryTitle>
        <FortuneText>{fortune.health}</FortuneText>
        
        <CategoryTitle>幸运数字</CategoryTitle>
        <LuckyNumbers>
          {fortune.luckyNumbers.map((number, index) => (
            <LuckyNumber key={index}>{number}</LuckyNumber>
          ))}
        </LuckyNumbers>
      </FortuneCard>
      
      <GenerateButton onClick={generateFortune}>
        重新测算
      </GenerateButton>
    </FortuneContainer>
  );
} 