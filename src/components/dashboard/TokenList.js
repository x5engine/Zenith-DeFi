import React from 'react';
import styled from 'styled-components';
import { User, Star, ArrowRight } from 'lucide-react';

const TokenListContainer = styled.div`
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #3a3a3a;
  height: fit-content;
`;

const TokenItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
  border: 1px solid #4a4a4a;

  &:hover {
    background: linear-gradient(135deg, #4a4a4a, #3a3a3a);
    transform: translateX(4px);
  }
`;

const TokenIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: ${props => props.color};
  font-weight: bold;
  font-size: 12px;
  color: white;
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 2px;
`;

const TokenValue = styled.div`
  font-size: 12px;
  color: #a0a0a0;
`;

const TokenAmount = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-right: 8px;
`;

const ArrowIcon = styled.div`
  color: #a0a0a0;
  transition: color 0.2s ease;

  ${TokenItem}:hover & {
    color: #8b5cf6;
  }
`;

const TokenList = () => {
  const tokens = [
    {
      icon: User,
      color: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      name: 'Carica EA',
      value: 'TUTU LEM',
      amount: '714.8 Bit'
    },
    {
      icon: User,
      color: 'linear-gradient(135deg, #10b981, #059669)',
      name: 'Resebio',
      value: 'IT. OD 32ACS',
      amount: ''
    },
    {
      icon: 'B',
      color: 'linear-gradient(135deg, #f59e0b, #f97316)',
      name: 'Niblul',
      value: 'ВАЗЕЕ НО',
      amount: ''
    },
    {
      icon: 'P',
      color: 'linear-gradient(135deg, #6b7280, #9ca3af)',
      name: 'Necto',
      value: 'moooss',
      amount: ''
    },
    {
      icon: Star,
      color: 'linear-gradient(135deg, #f59e0b, #f97316)',
      name: 'Konstn. Mestites',
      value: '2.020',
      amount: ''
    },
    {
      icon: 'N',
      color: 'linear-gradient(135deg, #f59e0b, #f97316)',
      name: 'Nitle Dandy ELLNE',
      value: '8.0.84',
      amount: ''
    },
    {
      icon: 'D',
      color: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      name: 'Viss Brond SOMAATR',
      value: '2.906',
      amount: ''
    },
    {
      icon: 'A',
      color: 'linear-gradient(135deg, #f59e0b, #f97316)',
      name: 'Adeic',
      value: '7.838',
      amount: ''
    },
    {
      icon: 'P',
      color: 'linear-gradient(135deg, #f59e0b, #f97316)',
      name: 'Paide OG LERTO',
      value: '2.4MBS',
      amount: ''
    }
  ];

  return (
    <TokenListContainer>
      {tokens.map((token, index) => (
        <TokenItem key={index}>
          <TokenIcon color={token.color}>
            {typeof token.icon === 'string' ? (
              token.icon
            ) : (
              <token.icon size={16} />
            )}
          </TokenIcon>
          <TokenInfo>
            <TokenName>{token.name}</TokenName>
            <TokenValue>{token.value}</TokenValue>
          </TokenInfo>
          {token.amount && (
            <TokenAmount>{token.amount}</TokenAmount>
          )}
          <ArrowIcon>
            <ArrowRight size={16} />
          </ArrowIcon>
        </TokenItem>
      ))}
    </TokenListContainer>
  );
};

export default TokenList; 