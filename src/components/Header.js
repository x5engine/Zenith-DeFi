import React from 'react';
import styled from 'styled-components';
import { Search, Bell, User, ShoppingBag, Calendar, Flame } from 'lucide-react';

const HeaderContainer = styled.div`
  height: 70px;
  background-color: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #3a3a3a;
  border-radius: 8px;
  padding: 8px 16px;
  width: 100%;
  border: 1px solid #4a4a4a;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #8b5cf6;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  outline: none;
  margin-left: 8px;

  &::placeholder {
    color: #a0a0a0;
  }
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffffff;
    background-color: rgba(139, 92, 246, 0.1);
  }
`;

const ActionText = styled.span`
  font-size: 12px;
  font-weight: 500;
  margin-left: 4px;
`;

const IconButton = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SpecialIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <SearchSection>
        <SearchBar>
          <Search size={18} color="#a0a0a0" />
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
          <User size={18} color="white" />
        </IconButton>
        
        <IconButton>
          <ShoppingBag size={18} color="white" />
        </IconButton>
        
        <IconButton>
          <Calendar size={18} color="white" />
        </IconButton>
        
        <SpecialIcon>
          <Flame size={18} color="white" />
        </SpecialIcon>
      </ActionSection>
    </HeaderContainer>
  );
};

export default Header; 