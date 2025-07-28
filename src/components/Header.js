import React from 'react';
import styled from 'styled-components';
import { Search, Bell, User, ShoppingBag, Calendar, Flame } from 'lucide-react';

const HeaderContainer = styled.div`
  height: 80px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 450px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 12px;
  padding: 12px 20px;
  width: 100%;
  border: 1px solid #3a3a3a;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:focus-within {
    border-color: #8b5cf6;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
    transform: translateY(-1px);
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  width: 100%;
  outline: none;
  margin-left: 12px;

  &::placeholder {
    color: #808080;
    font-weight: 400;
  }
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;

  &:hover {
    color: #ffffff;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-1px);
  }
`;

const ActionText = styled.span`
  font-size: 13px;
  font-weight: 600;
  margin-left: 6px;
  letter-spacing: -0.01em;
`;

const IconButton = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  }
`;

const SpecialIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <SearchSection>
        <SearchBar>
          <Search size={20} color="#808080" />
          <SearchInput placeholder="Sosine Disupiny Shutte" />
        </SearchBar>
      </SearchSection>

      <ActionSection>
        <ActionButton>
          <Search size={18} />
        </ActionButton>
        
        <ActionButton>
          <ActionText>Sel Ack</ActionText>
        </ActionButton>
        
        <ActionButton>
          <Bell size={18} />
        </ActionButton>
        
        <IconButton>
          <User size={20} color="white" />
        </IconButton>
        
        <IconButton>
          <ShoppingBag size={20} color="white" />
        </IconButton>
        
        <IconButton>
          <Calendar size={20} color="white" />
        </IconButton>
        
        <SpecialIcon>
          <Flame size={20} color="white" />
        </SpecialIcon>
      </ActionSection>
    </HeaderContainer>
  );
};

export default Header; 