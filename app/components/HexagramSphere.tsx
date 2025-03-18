'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import styled from '@emotion/styled';
import * as THREE from 'three';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
`;

interface Position {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

// 六十四卦的符号数据
const hexagrams = [
  "䷀", "䷁", "䷂", "䷃", "䷄", "䷅", "䷆", "䷇", "䷈", "䷉", "䷊", "䷋", "䷌", "䷍", "䷎", "䷏",
  "䷐", "䷑", "䷒", "䷓", "䷔", "䷕", "䷖", "䷗", "䷘", "䷙", "䷚", "䷛", "䷜", "䷝", "䷞", "䷟",
  "䷠", "䷡", "䷢", "䷣", "䷤", "䷥", "䷦", "䷧", "䷨", "䷩", "䷪", "䷫", "䷬", "䷭", "䷮", "䷯",
  "䷰", "䷱", "䷲", "䷳", "䷴", "䷵", "䷶", "䷷", "䷸", "䷹", "䷺", "䷻", "䷼", "䷽", "䷾", "䷿"
];

// 计算两点之间的距离
const distance = (p1: Position, p2: Position) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + 
    Math.pow(p1.y - p2.y, 2) + 
    Math.pow(p1.z - p2.z, 2)
  );
};

// 确保相机能看到所有卦象
function CameraAdjuster() {
  const { camera } = useThree();
  
  useEffect(() => {
    // 调整相机位置以确保能看到整个球体
    camera.position.set(0, 0, 25);
    camera.updateProjectionMatrix();
  }, [camera]);
  
  return null;
}

// 单个卦象组件，确保面向球心
function HexagramText({ position, text, index }: { position: [number, number, number], text: string, index: number }) {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (textRef.current) {
      // 计算从卦象位置指向球心的方向向量
      const direction = new THREE.Vector3(0, 0, 0).sub(new THREE.Vector3(...position));
      // 创建一个向上的向量
      const up = new THREE.Vector3(0, 1, 0);
      // 创建一个四元数，使z轴指向球心
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        direction.normalize()
      );
      // 应用旋转
      textRef.current.quaternion.copy(quaternion);
    }
  });
  
  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={1.5}
      color="#000000"
      anchorX="center"
      anchorY="middle"
      font="/fonts/NotoSerifSC-Bold.ttf"
    >
      {text}
    </Text>
  );
}

// 六十四卦球体
function HexagramGlobe() {
  const sphereRef = useRef<THREE.Group>(null);
  const positionsRef = useRef<Position[]>([]);
  const radius = 10; // 球体半径
  
  // 生成卦象位置和连接
  const { positions, connections } = useMemo(() => {
    const positions = [];
    
    // 为每个卦象生成初始位置 - 使用斐波那契球面分布算法
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < hexagrams.length; i++) {
      const y = 1 - (i / (hexagrams.length - 1)) * 2; // -1 到 1
      const radiusAtY = Math.sqrt(1 - y * y); // 在该y值的圆半径
      
      const theta = 2 * Math.PI * i / goldenRatio; // 黄金角旋转
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      


      // 添加到球面上
      positions.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        // 添加随机速度向量，用于移动
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
        vz: (Math.random() - 0.5) * 0.03
      } as Position);
    }
    
    // 计算卦象之间的连接
    const connections = [];
    const connectionThreshold = 6; // 连接的距离阈值
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = distance(positions[i], positions[j]);
        if (dist < connectionThreshold) {
          connections.push([i, j]);
        }
      }
    }
    
    positionsRef.current = positions;
    return { positions, connections };
  }, []);
  
  // 动画：卦象在球面上移动
  useFrame(() => {
    const positions = positionsRef.current;
    
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      
      // 更新位置
      pos.x += pos.vx;
      pos.y += pos.vy;
      pos.z += pos.vz;
      
      // 计算到球心的距离
      const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
      
      // 如果卦象偏离了球面，将其拉回球面
      if (Math.abs(dist - radius) > 0.1) {
        const factor = radius / dist;
        pos.x *= factor;
        pos.y *= factor;
        pos.z *= factor;
      }
      
      // 随机改变方向（低概率）
      if (Math.random() < 0.005) {
        pos.vx = (Math.random() - 0.5) * 0.03;
        pos.vy = (Math.random() - 0.5) * 0.03;
        pos.vz = (Math.random() - 0.5) * 0.03;
      }
    }
    
    // 更新球体旋转
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001;
    }
  });
  
  // 黑色连接线
  const lineColor = "#000000";
  
  return (
    <group ref={sphereRef}>
      {/* 卦象 - 使用专门的组件确保面向球心 */}
      {hexagrams.map((hexagram, index) => (
        <HexagramText
          key={`hexagram-${index}`}
          position={[positions[index].x, positions[index].y, positions[index].z]}
          text={hexagram}
          index={index}
        />
      ))}
      
      {/* 连接线 */}
      {connections.map((connection, index) => {
        const start = positions[connection[0]];
        const end = positions[connection[1]];
        
        return (
          <Line
            key={`connection-${index}`}
            points={[[start.x, start.y, start.z], [end.x, end.y, end.z]]}
            color={lineColor}
            lineWidth={1.0}
            opacity={0.5}
            transparent
          />
        );
      })}
    </group>
  );
}

// 主场景
function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <HexagramGlobe />
      <CameraAdjuster />
      <OrbitControls 
        enableZoom={true}
        minDistance={15}
        maxDistance={35}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function HexagramSphere() {
  return (
    <Container>
      <Canvas>
        <Scene />
      </Canvas>
    </Container>
  );
} 