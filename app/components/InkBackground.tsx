'use client';

import { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background-color: #f8f8f8;
`;

const SVG = styled.svg`
  width: 100%;
  height: 100%;
`;

// 生成毛笔笔画路径 - 只用于确定墨点位置，不会显示
const generateBrushStroke = (startX: number, startY: number, length: number, direction: number) => {
  // 基本路径起点
  let path = `M${startX},${startY}`;
  
  // 当前位置
  let x = startX;
  let y = startY;
  
  // 基本方向（弧度）
  const baseAngle = (direction * Math.PI) / 180;
  
  // 减少控制点数量，使曲线更圆滑
  const pointCount = 3 + Math.floor(Math.random() * 3);
  
  // 创建更圆滑的毛笔路径
  for (let i = 0; i < pointCount; i++) {
    // 减小方向变化，使线条更圆滑
    const angleVariation = (Math.random() - 0.5) * 0.3;
    const currentAngle = baseAngle + angleVariation;
    
    // 步长 - 更长的步长，减少转折
    const stepLength = (length / pointCount) * (0.9 + Math.random() * 0.3);
    
    // 计算下一个点
    const nextX = x + Math.cos(currentAngle) * stepLength;
    const nextY = y + Math.sin(currentAngle) * stepLength;
    
    // 控制点 - 增加控制点距离，使曲线更圆滑
    const controlX1 = x + Math.cos(currentAngle - 0.1) * stepLength * 0.5;
    const controlY1 = y + Math.sin(currentAngle - 0.1) * stepLength * 0.5;
    const controlX2 = nextX - Math.cos(currentAngle + 0.1) * stepLength * 0.5;
    const controlY2 = nextY - Math.sin(currentAngle + 0.1) * stepLength * 0.5;
    
    // 添加三次贝塞尔曲线
    path += ` C${controlX1},${controlY1} ${controlX2},${controlY2} ${nextX},${nextY}`;
    
    // 更新当前位置
    x = nextX;
    y = nextY;
  }
  
  return path;
};

// 生成墨点晕染效果
const generateInkBlot = (centerX: number, centerY: number, size: number) => {
  let path = `M${centerX},${centerY}`;
  // 减少点数，使形状更圆滑
  const points = 6 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    // 增加基础大小，使墨点更大
    const distance = size * (0.8 + Math.random() * 0.5);
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    if (i === 0) {
      path += ` Q`;
    } else {
      // 调整控制点，使曲线更圆滑
      const controlX = centerX + Math.cos(angle - Math.PI/points) * distance * 1.3;
      const controlY = centerY + Math.sin(angle - Math.PI/points) * distance * 1.3;
      path += `${controlX},${controlY} ${x},${y} `;
      
      if (i < points) {
        path += `Q`;
      }
    }
  }
  
  return path;
};

const InkBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inkBlotsRef = useRef<SVGPathElement[]>([]);
  const pathsRef = useRef<SVGPathElement[]>([]);

  // 创建SVG元素
  useGSAP(() => {
    if (!containerRef.current) return;
    
    // 清除引用数组
    inkBlotsRef.current = [];
    pathsRef.current = [];
    
    // 获取SVG元素
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;
    
    // 清除现有内容
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // 添加滤镜定义
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    // 墨水晕染滤镜 - 更强的扩散效果
    const inkDiffuseFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    inkDiffuseFilter.setAttribute("id", "ink-diffuse");
    inkDiffuseFilter.setAttribute("x", "-50%");
    inkDiffuseFilter.setAttribute("y", "-50%");
    inkDiffuseFilter.setAttribute("width", "200%");
    inkDiffuseFilter.setAttribute("height", "200%");
    
    // 高斯模糊 - 更强的扩散效果
    const feBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feBlur.setAttribute("in", "SourceGraphic");
    feBlur.setAttribute("stdDeviation", "12"); // 增加模糊，使墨点扩散更明显
    
    // 对比度调整 - 模拟墨水在纸上的扩散
    const feComponentTransfer = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
    const feFuncA = document.createElementNS("http://www.w3.org/2000/svg", "feFuncA");
    feFuncA.setAttribute("type", "table");
    feFuncA.setAttribute("tableValues", "0 0.3 0.6 0.8 0.9"); // 调整对比度
    feComponentTransfer.appendChild(feFuncA);
    
    inkDiffuseFilter.appendChild(feBlur);
    inkDiffuseFilter.appendChild(feComponentTransfer);
    defs.appendChild(inkDiffuseFilter);
    
    // 添加纹理滤镜
    const textureFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    textureFilter.setAttribute("id", "paper-texture");
    textureFilter.setAttribute("x", "0%");
    textureFilter.setAttribute("y", "0%");
    textureFilter.setAttribute("width", "100%");
    textureFilter.setAttribute("height", "100%");
    
    // 添加纸张纹理
    const feTurbulence = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
    feTurbulence.setAttribute("type", "fractalNoise");
    feTurbulence.setAttribute("baseFrequency", "0.04");
    feTurbulence.setAttribute("numOctaves", "5");
    feTurbulence.setAttribute("seed", Math.random().toString());
    feTurbulence.setAttribute("result", "noise");
    
    // 位移映射 - 创造纸张纹理
    const feDisplacementMap = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
    feDisplacementMap.setAttribute("in", "SourceGraphic");
    feDisplacementMap.setAttribute("in2", "noise");
    feDisplacementMap.setAttribute("scale", "3");
    feDisplacementMap.setAttribute("xChannelSelector", "R");
    feDisplacementMap.setAttribute("yChannelSelector", "G");
    
    textureFilter.appendChild(feTurbulence);
    textureFilter.appendChild(feDisplacementMap);
    defs.appendChild(textureFilter);
    
    svg.appendChild(defs);
    
    // 创建毛笔笔画路径（不可见，只用于确定墨点位置）
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // 创建几组墨迹
    const strokeGroups = 2 + Math.floor(Math.random() * 2);
    
    for (let g = 0; g < strokeGroups; g++) {
      // 每组的中心位置
      const groupCenterX = width * (0.2 + Math.random() * 0.6);
      const groupCenterY = height * (0.2 + Math.random() * 0.6);
      
      // 每组的笔画数量
      const strokeCount = 1 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < strokeCount; i++) {
        // 笔画起点 - 在组中心附近
        const startX = groupCenterX + (Math.random() - 0.5) * 80;
        const startY = groupCenterY + (Math.random() - 0.5) * 80;
        
        // 笔画长度和方向
        const strokeLength = 200 + Math.random() * 300;
        const direction = Math.random() * 360;
        
        // 生成毛笔路径（不可见）
        const pathData = generateBrushStroke(startX, startY, strokeLength, direction);
        
        // 创建隐藏的路径元素，只用于计算位置
        const hiddenPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        hiddenPath.setAttribute("d", pathData);
        hiddenPath.setAttribute("fill", "none");
        hiddenPath.setAttribute("stroke", "none");
        hiddenPath.style.display = "none";
        
        svg.appendChild(hiddenPath);
        pathsRef.current.push(hiddenPath);
        
        // 在路径上添加多个墨点晕染
        const pathLength = hiddenPath.getTotalLength();
        
        // 主要墨点 - 沿路径均匀分布
        const mainBlotCount = 5 + Math.floor(Math.random() * 5);
        for (let j = 0; j < mainBlotCount; j++) {
          // 在路径上均匀分布位置
          const position = j / (mainBlotCount - 1);
          const point = hiddenPath.getPointAtLength(position * pathLength);
          
          // 墨点大小 - 中间大，两端小
          const sizeVariation = Math.sin(position * Math.PI);
          const blotSize = 15 + sizeVariation * 40 + Math.random() * 30;
          
          // 生成墨点路径
          const blotPath = generateInkBlot(point.x, point.y, blotSize);
          
          // 创建墨点
          const inkBlot = document.createElementNS("http://www.w3.org/2000/svg", "path");
          inkBlot.setAttribute("d", blotPath);
          inkBlot.setAttribute("fill", `rgba(0, 0, 0, ${0.15 + Math.random() * 0.25 + sizeVariation * 0.1})`);
          inkBlot.setAttribute("stroke", "none");
          inkBlot.setAttribute("filter", "url(#ink-diffuse)");
          inkBlot.setAttribute("opacity", "0");
          
          svg.appendChild(inkBlot);
          inkBlotsRef.current.push(inkBlot);
        }
        
        // 添加一些随机的小墨点
        const smallBlotCount = 3 + Math.floor(Math.random() * 5);
        for (let j = 0; j < smallBlotCount; j++) {
          // 在路径附近随机位置
          const randomPosition = Math.random();
          const pathPoint = hiddenPath.getPointAtLength(randomPosition * pathLength);
          
          // 随机偏移
          const offsetX = (Math.random() - 0.5) * 40;
          const offsetY = (Math.random() - 0.5) * 40;
          
          // 小墨点
          const smallBlotSize = 5 + Math.random() * 15;
          const smallBlotPath = generateInkBlot(
            pathPoint.x + offsetX, 
            pathPoint.y + offsetY, 
            smallBlotSize
          );
          
          // 创建小墨点
          const smallInkBlot = document.createElementNS("http://www.w3.org/2000/svg", "path");
          smallInkBlot.setAttribute("d", smallBlotPath);
          smallInkBlot.setAttribute("fill", `rgba(0, 0, 0, ${0.1 + Math.random() * 0.15})`);
          smallInkBlot.setAttribute("stroke", "none");
          smallInkBlot.setAttribute("filter", "url(#ink-diffuse)");
          smallInkBlot.setAttribute("opacity", "0");
          
          svg.appendChild(smallInkBlot);
          inkBlotsRef.current.push(smallInkBlot);
        }
      }
    }
    
    // 添加一些独立的墨点
    const independentBlotCount = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < independentBlotCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 10 + Math.random() * 30;
      
      const blotPath = generateInkBlot(x, y, size);
      
      const independentBlot = document.createElementNS("http://www.w3.org/2000/svg", "path");
      independentBlot.setAttribute("d", blotPath);
      independentBlot.setAttribute("fill", `rgba(0, 0, 0, ${0.1 + Math.random() * 0.15})`);
      independentBlot.setAttribute("stroke", "none");
      independentBlot.setAttribute("filter", "url(#ink-diffuse)");
      independentBlot.setAttribute("opacity", "0");
      
      svg.appendChild(independentBlot);
      inkBlotsRef.current.push(independentBlot);
    }
  }, []);

  // 创建动画
  useGSAP(() => {
    // 为墨点创建动画
    inkBlotsRef.current.forEach((blot, index) => {
      // 创建时间线
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 15 + Math.random() * 25,
        delay: index * 0.8
      });
      
      // 墨点扩散动画
      tl.to(blot, {
        opacity: 0.9,
        duration: 1.2,
        ease: "power1.in"
      })
      .to(blot, {
        scale: 1.8 + Math.random() * 1.2,
        opacity: 0.3,
        duration: 15 + Math.random() * 10,
        ease: "power1.inOut"
      }, "<0.5")
      .to(blot, {
        opacity: 0,
        duration: 8,
        ease: "power2.in"
      }, "-=5");
    });
  }, []);

  // 窗口大小变化时重新创建
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
          }
          inkBlotsRef.current = [];
          pathsRef.current = [];
          
          gsap.globalTimeline.clear();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Container ref={containerRef}>
      <SVG />
    </Container>
  );
};

export default InkBackground; 