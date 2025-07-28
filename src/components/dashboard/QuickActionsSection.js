import React from 'react';
import styled from 'styled-components';
import { User, Infinity, ArrowRight } from 'lucide-react';

const QuickActionsContainer = styled.div`
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #3a3a3a;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

const ActionCard = styled.div`
  background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #4a4a4a;
  text-align: center;
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  background: ${props => props.color};
`;

const ActionValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
`;

const ActionText = styled.div`
  font-size: 12px;
  color: #a0a0a0;
`;

const BottomSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FlameIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

const QuickActionsSection = () => {
  const actionCards = [
    {
      icon: User,
      color: 'linear-gradient(135deg, #f59e0b, #f97316)',
      value: '$89.09',
      text: '7810 Theboud'
    },
    {
      icon: User,
      color: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      value: '66S5',
      text: '1. O GIA S'
    },
    {
      icon: User,
      color: 'linear-gradient(135deg, #10b981, #059669)',
      value: 'S667',
      text: '2008 deale Dies'
    },
    {
      icon: Infinity,
      color: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      value: '$183',
      text: '1804 doncs'
    },
    {
      icon: User,
      color: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      value: '9X:18',
      text: '3400'
    }
  ];

  return (
    <QuickActionsContainer>
      <ActionsGrid>
        {actionCards.map((card, index) => (
          <ActionCard key={index}>
            <ActionIcon color={card.color}>
              <card.icon size={20} color="white" />
            </ActionIcon>
            <ActionValue>{card.value}</ActionValue>
            <ActionText>{card.text}</ActionText>
          </ActionCard>
        ))}
      </ActionsGrid>

      <BottomSection>
        <FlameIcon>
          <User size={20} color="white" />
        </FlameIcon>
        
        <ButtonGroup>
          <ActionButton>
            Noll. 0.5
            <ArrowRight size={16} />
          </ActionButton>
          <ActionButton>
            Voll QES
            <ArrowRight size={16} />
          </ActionButton>
        </ButtonGroup>
      </BottomSection>
    </QuickActionsContainer>
  );
};

export default QuickActionsSection; 