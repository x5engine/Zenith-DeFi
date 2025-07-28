import React from 'react';
import styled from 'styled-components';
import { Search, Bell, User, ShoppingBag, Calendar, Flame } from 'lucide-react';

const HeaderContainer = styled.div`
  height: 90px;
  background: #000000;
  border-bottom: 3px solid #8b5cf6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%);
  }
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 500px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #0a0a0a;
  border-radius: 0;
  padding: 16px 24px;
  width: 100%;
  border: 2px solid #1a1a1a;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  position: relative;

  &:focus-within {
    border-color: #8b5cf6;
    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.3);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  width: 100%;
  outline: none;
  margin-left: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &::placeholder {
    color: #666666;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 2px solid transparent;
  color: #666666;
  cursor: pointer;
  padding: 12px;
  border-radius: 0;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    color: #ffffff;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
    border-color: #8b5cf6;
    transform: translateY(-2px);
  }
`;

const ActionText = styled.span`
  font-size: 12px;
  font-weight: 800;
  margin-left: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const IconButton = styled.div`
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.5);
  border: 2px solid #8b5cf6;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.6);
  }
`;

const SpecialIcon = styled.div`
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%);
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.5);
  border: 2px solid #f59e0b;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 40px rgba(245, 158, 11, 0.6);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <SearchSection>
        <SearchBar>
          <Search size={22} color="#666666" />
          <SearchInput placeholder="Sosine Disupiny Shutte" />
        </SearchBar>
      </SearchSection>

      <ActionSection>
        <ActionButton>
          <Search size={20} />
        </ActionButton>
        
        <ActionButton>
          <ActionText>Sel Ack</ActionText>
        </ActionButton>
        
        <ActionButton>
          <Bell size={20} />
        </ActionButton>
        
        <IconButton>
          <User size={22} color="white" />
        </IconButton>
        
        <IconButton>
          <ShoppingBag size={22} color="white" />
        </IconButton>
        
        <IconButton>
          <Calendar size={22} color="white" />
        </IconButton>
        
        <SpecialIcon>
          <Flame size={22} color="white" />
        </SpecialIcon>
      </ActionSection>
    </HeaderContainer>
  );
};

export default Header; 