'use client';

import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const ChatHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 10px;
  background-color: ${props => props.isUser ? '#007AFF' : '#E5E5EA'};
  color: ${props => props.isUser ? 'white' : 'black'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.isUser ? 'auto' : '0'};
  margin-right: ${props => props.isUser ? '0' : 'auto'};
`;

const InputContainer = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  padding: 5px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 10px 15px;
  border-radius: 24px;
  font-size: 16px;
  background: transparent;
  outline: none;
`;

const SendButton = styled.button`
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 10px;
  
  &:disabled {
    background-color: #B0B0B0;
  }
`;

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '欢迎来到聊天室，有什么我可以帮助你的吗？', isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // 添加用户消息
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true
    };
    
    setMessages([...messages, newUserMessage]);
    setInput('');
    
    // 模拟回复
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: `我收到了你的消息："${input}"。这是一个自动回复。`,
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatContainer>
      <ChatHeader>聊天</ChatHeader>
      <MessagesContainer>
        {messages.map(message => (
          <MessageBubble key={message.id} isUser={message.isUser}>
            {message.text}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <SendButton onClick={handleSend} disabled={input.trim() === ''}>
          ↑
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
} 