'use client';

import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactMarkdown from 'react-markdown';
import { FaArrowLeft } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { generateHexagram, getDivinationResult } from '../api';
import HexagramDisplay from '../components/HexagramDisplay';

const BuContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  padding: 20px;
  padding-bottom: 100px;
  max-width: 800px;
  margin: 0 auto;
  overflow-y: auto;
  position: relative;
`;

const InitialContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
`;

const QuestionText = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 56px;
  max-height: 120px;
  padding: 15px;
  padding-right: 60px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  line-height: 1.5;
  background-color: rgba(255, 255, 255, 0.7);
  outline: none;
  resize: none;
  margin-bottom: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow-y: hidden;
  box-sizing: border-box;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const CharCount = styled.div<{ isNearLimit: boolean }>`
  position: absolute;
  left: 15px;
  bottom: -20px;
  font-size: 12px;
  color: ${props => props.isNearLimit ? '#ff4d4f' : '#999'};
`;

const SendButton = styled.button<{ canSubmit: boolean }>`
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: ${props => props.canSubmit ? '#4A4A4A' : '#e0e0e0'};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: ${props => props.canSubmit ? 'pointer' : 'not-allowed'};
  color: ${props => props.canSubmit ? 'white' : '#999'};
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: ${props => props.canSubmit ? '0 2px 6px rgba(0,0,0,0.2)' : 'none'};

  &:hover {
    background-color: ${props => props.canSubmit ? '#333' : '#e0e0e0'};
    transform: ${props => props.canSubmit ? 'scale(1.05)' : 'none'};
  }

  svg {
    font-size: 20px;
  }
`;

const ExampleContainer = styled.div`
  position: relative;
  height: 60px;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
`;

const ExampleText = styled(motion.div)`
  position: absolute;
  width: 100%;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  font-size: 16px;
`;

const MatterText = styled(motion.div)`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4A4A4A;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled(motion.div)`
  margin-top: 30px;
  padding: 20px;
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  gap: 15px;
  color: #666;
`;

const LoadingIcon = styled(motion.div)`
  font-size: 24px;
  color: #4A4A4A;
`;

const LoadingText = styled.div`
  font-size: 16px;
`;

const MarkdownContent = styled.div`
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }
  
  h1 {
    font-size: 1.8em;
  }
  
  h2 {
    font-size: 1.5em;
  }
  
  h3 {
    font-size: 1.3em;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  ul, ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
  }
  
  li {
    margin-bottom: 0.5em;
  }
  
  blockquote {
    border-left: 4px solid #ccc;
    padding-left: 1em;
    margin-left: 0;
    color: #555;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #333;
  }

  svg {
    font-size: 14px;
  }
`;

const examples = [
  "今天下午七点和朋友吃饭",
  "明天面试能否顺利通过",
  "这个项目能否按时完成",
  "最近的感情运势如何",
  "下个月的工作发展"
];

interface Result {
  symbol: string;
  name: string;
  description: string;
  interpretation: string;
}

export default function BuPage() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [matter, setMatter] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [divinationId, setDivinationId] = useState<string>('');
  const [backendLines, setBackendLines] = useState<string[]>([]);
  const [hexagramName, setHexagramName] = useState<string>('');
  const [isPolling, setIsPolling] = useState(false);

  // 文字轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 轮询获取占卜结果
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollResult = async () => {
      if (!divinationId || !isPolling) return;

      try {
        const resultData = await getDivinationResult(divinationId);
        if (resultData.is_ready) {
          setResult({
            symbol: "䷀", // 这里可以根据卦象添加对应的符号
            name: hexagramName,
            description: `${hexagramName}卦代表...`,
            interpretation: resultData.interpretation
          });
          setIsPolling(false);
        }
      } catch (error) {
        console.error('获取占卜结果失败:', error);
        setIsPolling(false);
      }
    };

    if (isPolling) {
      intervalId = setInterval(pollResult, 2000); // 每2秒轮询一次
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [divinationId, isPolling, hexagramName]);

  // 自动调整文本框高度
  const adjustTextAreaHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.min(textArea.scrollHeight, 120)}px`;
    }
  };

  // 处理输入
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setMatter(value);
      adjustTextAreaHeight();
    }
  };

  // 处理按键
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (matter.trim()) {
        handleSubmit();
      }
    }
  };

  // 处理提交
  const handleSubmit = async () => {
    if (!matter.trim()) return;
    try {
      const { id, lines, hexagram } = await generateHexagram(matter);
      setDivinationId(id);
      setBackendLines(lines);
      setHexagramName(hexagram);
      setIsSubmitted(true);
    } catch (error) {
      console.error('生成卦象失败', error);
      toast.error('生成卦象失败，请重试');
    }
  };

  // 生成随机爻
  const generateRandomLine = () => {
    if (currentLine >= backendLines.length) return 'yang';
    return backendLines[currentLine];
  };

  // 处理摇卦
  const handleShake = async () => {
    if (currentLine >= 6) return;

    setIsLoading(true);
    const newLine = generateRandomLine();
    setLines(prev => [...prev, newLine]);
    setCurrentLine(prev => prev + 1);
    setIsLoading(false);

    if (currentLine + 1 >= 6) {
      // 所有爻都生成完成，开始轮询结果
      setIsPolling(true);
    }
  };

  // 一键摇卦
  const handleQuickShake = async () => {
    setIsLoading(true);
    setLines(backendLines);
    setCurrentLine(6);
    setIsLoading(false);
    // 开始轮询结果
    setIsPolling(true);
  };

  // 处理返回
  const handleBack = () => {
    // 重置所有状态
    setMatter('');
    setIsSubmitted(false);
    setCurrentLine(0);
    setLines([]);
    setResult(null);
    setIsLoading(false);
    setDivinationId('');
    setBackendLines([]);
    setHexagramName('');
    setIsPolling(false);
  };

  return (
    <BuContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      {!isSubmitted ? (
        <InitialContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <QuestionText>所卜何事？</QuestionText>
          <InputContainer>
            <TextArea
              ref={textAreaRef}
              value={matter}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
              placeholder="请输入你想占卜的事项..."
              rows={1}
            />
            <CharCount isNearLimit={matter.length >= 80}>
              {matter.length}/100
            </CharCount>
            <SendButton 
              onClick={handleSubmit}
              canSubmit={matter.trim() !== ''}
              disabled={matter.trim() === ''}
              title="开始占卜"
            >
              <BsArrowReturnLeft />
            </SendButton>
          </InputContainer>
          <ExampleContainer>
            <AnimatePresence mode="wait">
              <ExampleText
                key={currentExampleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {examples[currentExampleIndex]}
              </ExampleText>
            </AnimatePresence>
          </ExampleContainer>
        </InitialContainer>
      ) : (
        <>
          <BackButton onClick={handleBack}>
            <FaArrowLeft />
            重新占卜
          </BackButton>
          <MatterText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {matter}
          </MatterText>
          
          {currentLine < 6 && (
            <ButtonContainer>
              <Button onClick={handleShake} disabled={isLoading}>
                {isLoading ? '摇动中...' : `摇第 ${currentLine + 1} 爻`}
              </Button>
              <Button onClick={handleQuickShake} disabled={isLoading}>
                一键摇卦
              </Button>
            </ButtonContainer>
          )}
          
          <HexagramDisplay lines={lines} />
          
          {currentLine === 6 && !result && (
            <LoadingContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingIcon
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <AiOutlineLoading3Quarters />
              </LoadingIcon>
              <LoadingText>正在解卦，请稍候...</LoadingText>
            </LoadingContainer>
          )}
          
          {result && (
            <ResultContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MarkdownContent>
                <ReactMarkdown>
                  {result.interpretation}
                </ReactMarkdown>
              </MarkdownContent>
            </ResultContainer>
          )}
        </>
      )}
    </BuContainer>
  );
} 