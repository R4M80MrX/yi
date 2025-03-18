'use client';

import styled from '@emotion/styled';

interface HexagramDisplayProps {
  lines: string[];
  currentLine: number;
}

const HexagramContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  padding: 20px;
`;

const Line = styled.div<{ type: string }>`
  width: 120px;
  height: 6px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const YangLine = styled.div`
  width: 100%;
  height: 6px;
  background-color: #000;
  border-radius: 3px;
`;

const YinLine = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const YinLineSegment = styled.div`
  width: 48%;
  height: 6px;
  background-color: #000;
  border-radius: 3px;
`;

const HexagramDisplay = ({ lines, currentLine }: HexagramDisplayProps) => {
  return (
    <HexagramContainer>
      {lines.map((type, index) => (
        <Line key={index} type={type}>
          {type.includes('yin') ? (
            <YinLine>
              <YinLineSegment />
              <YinLineSegment />
            </YinLine>
          ) : (
            <YangLine />
          )}
        </Line>
      ))}
    </HexagramContainer>
  );
};

export default HexagramDisplay; 