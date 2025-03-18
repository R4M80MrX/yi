'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const DivinationContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const DivinationHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const QuestionInput = styled.input`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  outline: none;
`;

const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
`;

const CoinContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const Coin = styled.div<{ shaking: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #FFD700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${props => props.shaking ? shake : 'none'} 0.5s ease infinite;
`;

const ShakeButton = styled.button`
  background-color: #FF9500;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #cc7a00;
  }
  
  &:disabled {
    background-color: #B0B0B0;
    cursor: not-allowed;
  }
`;

const ResultCard = styled.div`
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HexagramSymbol = styled.div`
  font-size: 72px;
  margin-bottom: 20px;
`;

const HexagramName = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const HexagramDescription = styled.div`
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
`;

// 六十四卦数据
const hexagrams = [
  { symbol: "䷀", name: "乾卦", description: "乾为天，刚健中正。元亨利贞，象征着事物昌盛兴旺、吉祥如意。" },
  { symbol: "䷁", name: "坤卦", description: "坤为地，柔顺厚德。利牝马之贞，象征着包容、顺从和宽厚。" },
  { symbol: "䷂", name: "屯卦", description: "水雷屯，始生之难。利建侯，勿用有攸往，象征着起始阶段的困难。" },
  { symbol: "䷃", name: "蒙卦", description: "山水蒙，蒙昧不明。利取女，象征着启蒙教育和开导。" },
  { symbol: "䷄", name: "需卦", description: "水天需，须待时机。有孚光亨，贞吉，利涉大川，象征着等待时机。" },
  { symbol: "䷅", name: "讼卦", description: "天水讼，争讼不休。有孚窒惕，中吉，终凶，象征着争执和诉讼。" },
  { symbol: "䷆", name: "师卦", description: "地水师，众人之众。贞丈人吉，无咎，象征着军队和纪律。" },
  { symbol: "䷇", name: "比卦", description: "水地比，亲比辅助。吉，原筮元永贞，无咎，象征着亲近和团结。" },
  { symbol: "䷈", name: "小畜卦", description: "风天小畜，蓄养待进。密云不雨，自我西郊，象征着小有收获。" },
  { symbol: "䷉", name: "履卦", description: "天泽履，脚踏实地。履虎尾，不咥人，亨，象征着谨慎前行。" },
  { symbol: "䷊", name: "泰卦", description: "地天泰，通泰亨通。小往大来，吉亨，象征着和平与繁荣。" },
  { symbol: "䷋", name: "否卦", description: "天地否，闭塞不通。不利君子贞，大往小来，象征着阻塞和停滞。" },
  { symbol: "䷌", name: "同人卦", description: "天火同人，和同一致。同人于野，亨，利涉大川，象征着团结和协作。" },
  { symbol: "䷍", name: "大有卦", description: "火天大有，丰盛广大。元亨，象征着丰收和成功。" },
  { symbol: "䷎", name: "谦卦", description: "地山谦，谦虚谨慎。亨，君子有终，象征着谦逊和低调。" },
  { symbol: "䷏", name: "豫卦", description: "雷地豫，愉悦喜乐。利建侯行师，象征着愉快和满足。" }
];

export default function DivinationPage() {
  const [question, setQuestion] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [coins, setCoins] = useState([0, 0, 0]);
  const [result, setResult] = useState<typeof hexagrams[0] | null>(null);

  const shakeCoin = () => {
    if (!question.trim()) {
      alert('请先输入您的问题');
      return;
    }
    
    setIsShaking(true);
    
    // 模拟摇卦过程
    setTimeout(() => {
      // 随机生成三枚硬币的结果（0为阴，1为阳）
      const newCoins = [
        Math.round(Math.random()),
        Math.round(Math.random()),
        Math.round(Math.random())
      ];
      setCoins(newCoins);
      
      // 随机选择一个卦象作为结果
      const randomHexagram = hexagrams[Math.floor(Math.random() * hexagrams.length)];
      setResult(randomHexagram);
      
      setIsShaking(false);
    }, 2000);
  };

  return (
    <DivinationContainer>
      <DivinationHeader>周易算卦</DivinationHeader>
      
      <QuestionInput
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="请输入您想问的问题..."
      />
      
      <CoinContainer>
        {coins.map((coin, index) => (
          <Coin key={index} shaking={isShaking}>
            {isShaking ? '?' : coin === 1 ? '阳' : '阴'}
          </Coin>
        ))}
      </CoinContainer>
      
      <ShakeButton 
        onClick={shakeCoin} 
        disabled={isShaking || !question.trim()}
      >
        {isShaking ? '正在摇卦...' : '开始摇卦'}
      </ShakeButton>
      
      {result && (
        <ResultCard>
          <HexagramSymbol>{result.symbol}</HexagramSymbol>
          <HexagramName>{result.name}</HexagramName>
          <HexagramDescription>{result.description}</HexagramDescription>
        </ResultCard>
      )}
    </DivinationContainer>
  );
} 