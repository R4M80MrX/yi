'use client';

import { useState } from 'react';
import styled from '@emotion/styled';

const XiangContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const XiangHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

export default function XiangPage() {
  return (
    <XiangContainer>
      <XiangHeader>面相分析</XiangHeader>
      {/* 面相分析内容 */}
    </XiangContainer>
  );
} 