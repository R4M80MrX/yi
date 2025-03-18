'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { motion } from 'framer-motion';

// 添加自定义字体
const GlobalStyle = styled.div`
  @font-face {
    font-family: 'Bakudai';
    src: url('/fonts/Bakudai-Bold.woff') format('woff');
    font-weight: bold;
    font-style: normal;
  }
`;

const NavContainer = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  z-index: 100;
`;

const NavLink = styled(Link)`
  text-decoration: none;
`;

interface NavItemProps {
  active: boolean;
}

const NavItem = styled(motion.div)<NavItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: ${props => props.active ? '#000' : '#666'};
  transition: color 0.3s ease;
  font-family: 'Bakudai', sans-serif;
  font-size: 24px;
  font-weight: bold;
  
  &:hover {
    color: #000;
  }
`;

interface BottomNavBarProps {
  currentPath: string;
}

export default function BottomNavBar({ currentPath }: BottomNavBarProps) {
  // 定义导航项
  const navItems = [
    { path: '/', label: '山' },
    { path: '/ming', label: '命' },
    { path: '/bu', label: '卜' },
    { path: '/xiang', label: '相' },
    { path: '/yi', label: '医' }
  ];
  
  // 定义动画变体
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)"
    },
    tap: { 
      scale: 0.95 
    }
  };

  return (
    <>
      <GlobalStyle />
      <NavContainer>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', gap: '15px' }}
        >
          {navItems.map((item) => (
            <NavLink href={item.path} key={item.path}>
              <NavItem 
                active={currentPath === item.path} 
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {item.label}
              </NavItem>
            </NavLink>
          ))}
        </motion.div>
      </NavContainer>
    </>
  );
} 