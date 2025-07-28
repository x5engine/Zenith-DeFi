import React from 'react';
import styled from 'styled-components';
import { ChevronRight, User, Star } from 'lucide-react';

const TokenListContainer = styled.div`
  background: #000000;
  border-radius: 0;
  padding: 40px;
  border: 3px solid #8b5cf6;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
  position: relative;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #000000;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #8b5cf6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a855f7;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  text-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: #666666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TokenItem = styled.div`
  background: #0a0a0a;
  border-radius: 0;
  padding: 24px;
  margin-bottom: 16px;
  border: 3px solid #1a1a1a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'};
  }

  &:hover {
    transform: translateX(8px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.9);
    border-color: #8b5cf6;
  }
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: ${props => props.color};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  border: 2px solid #8b5cf6;
  position: relative;
  font-weight: 900;
  font-size: 18px;
  color: white;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => props.color};
    z-index: -1;
  }
`;

const TokenDetails = styled.div`
  flex: 1;
`;

const TokenName = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
  text-transform: uppercase;
`;

const TokenSubtitle = styled.div`
  font-size: 14px;
  color: #666666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TokenValue = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
  text-align: right;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(139, 92, 246, 0.5);
`;

const TokenArrow = styled.div`
  margin-left: 16px;
  display: flex;
  align-items: center;
  color: #666666;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${TokenItem}:hover & {
    color: #8b5cf6;
    transform: translateX(4px);
  }
`;

const TokenList = () => {
  const tokens = [
    {
      name: 'Carica EA',
      subtitle: 'TUTU LEM',
      value: '714.8 Bit',
      icon: 'C',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)',
      gradient: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'
    },
    {
      name: 'Resebio',
      subtitle: 'IT. OD 32ACS',
      value: 'IT. OD 32ACS',
      icon: 'R',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)',
      gradient: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)'
    },
    {
      name: 'Niblul',
      subtitle: 'BA3EE HO',
      value: 'BA3EE HO',
      icon: 'B',
      color: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)',
      gradient: 'linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)'
    },
    {
      name: 'Necto',
      subtitle: 'moooss',
      value: 'moooss',
      icon: 'N',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)',
      gradient: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'
    },
    {
      name: 'Konstn. Mestites',
      subtitle: '2.020',
      value: '2.020',
      icon: 'K',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)',
      gradient: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)'
    },
    {
      name: 'Nitle Dandy ELLNE',
      subtitle: '8.0.84',
      value: '8.0.84',
      icon: 'N',
      color: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)',
      gradient: 'linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)'
    },
    {
      name: 'Viss Brond SOMAATR',
      subtitle: '2.906',
      value: '2.906',
      icon: 'V',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)',
      gradient: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'
    },
    {
      name: 'Adeic',
      subtitle: '7.838',
      value: '7.838',
      icon: 'A',
      color: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)',
      gradient: 'linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)'
    },
    {
      name: 'Paide OG LERTO',
      subtitle: '2.4MBS',
      value: '2.4MBS',
      icon: 'P',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)',
      gradient: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'
    },
    {
      name: 'Additional Token 1',
      subtitle: '1.234',
      value: '1.234',
      icon: 'A',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)',
      gradient: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)'
    },
    {
      name: 'Additional Token 2',
      subtitle: '5.678',
      value: '5.678',
      icon: 'B',
      color: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)',
      gradient: 'linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)'
    },
    {
      name: 'Additional Token 3',
      subtitle: '9.012',
      value: '9.012',
      icon: 'C',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)',
      gradient: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'
    }
  ];

  return (
    <TokenListContainer>
      <SectionHeader>
        <SectionTitle>Token List</SectionTitle>
        <SectionSubtitle>Active tokens and balances</SectionSubtitle>
      </SectionHeader>

      {tokens.map((token, index) => (
        <TokenItem key={index} gradient={token.gradient}>
          <TokenHeader>
            <TokenInfo>
              <TokenIcon color={token.color}>
                {token.icon}
              </TokenIcon>
              <TokenDetails>
                <TokenName>{token.name}</TokenName>
                <TokenSubtitle>{token.subtitle}</TokenSubtitle>
              </TokenDetails>
            </TokenInfo>
            <TokenValue>{token.value}</TokenValue>
            <TokenArrow>
              <ChevronRight size={20} />
            </TokenArrow>
          </TokenHeader>
        </TokenItem>
      ))}
    </TokenListContainer>
  );
};

export default TokenList; 