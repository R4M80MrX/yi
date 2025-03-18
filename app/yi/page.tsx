'use client';

import { useState } from 'react';
import styled from '@emotion/styled';

const YiContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const YiHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

export default function YiPage() {
  return (
    <YiContainer>
      <YiHeader>中医养生</YiHeader>
      {/* 中医养生内容 */}
    </YiContainer>
  );
} 