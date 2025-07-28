import React from 'react';
import styled from 'styled-components';
import { Plus, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

const QuickActionsContainer = styled.div`
  background: #000000;
  border-radius: 0;
  padding: 40px;
  border: 3px solid #8b5cf6;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
  position: relative;

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

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
`;

const ActionCard = styled.div`
  background: #0a0a0a;
  border-radius: 0;
  padding: 32px;
  border: 3px solid #1a1a1a;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
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
    height: 3px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.9);
    border-color: #8b5cf6;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const CardIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  background: ${props => props.color};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  border: 2px solid #8b5cf6;
  position: relative;

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

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.01em;
  text-transform: uppercase;
`;

const CardSubtitle = styled.div`
  font-size: 14px;
  color: #666666;
  font-weight: 700;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const CardDescription = styled.p`
  font-size: 16px;
  color: #666666;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
  border: 3px solid #8b5cf6;
  color: white;
  padding: 16px 24px;
  border-radius: 0;
  cursor: pointer;
  font-weight: 800;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.5);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.6);
  }
`;

const ButtonIcon = styled.div`
  margin-left: 12px;
  display: flex;
  align-items: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const StatCard = styled.div`
  background: #0a0a0a;
  border-radius: 0;
  padding: 24px;
  border: 3px solid #1a1a1a;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.gradient || 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)'};
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const QuickActionsSection = () => {
  return (
    <QuickActionsContainer>
      <SectionHeader>
        <SectionTitle>Quick Actions</SectionTitle>
        <SectionSubtitle>Execute critical operations instantly</SectionSubtitle>
      </SectionHeader>

      <ActionsGrid>
        <ActionCard gradient="linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)">
              <Plus size={28} color="white" />
            </CardIcon>
            <div>
              <CardTitle>Create Channel</CardTitle>
              <CardSubtitle>New State Channel</CardSubtitle>
            </div>
          </CardHeader>
          <CardDescription>
            Initialize a new state channel for instant cross-exchange transfers with optimal liquidity routing.
          </CardDescription>
          <ActionButton>
            Create Channel
            <ButtonIcon>
              <ArrowRight size={18} />
            </ButtonIcon>
          </ActionButton>
        </ActionCard>

        <ActionCard gradient="linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #10b981 0%, #059669 50%, #10b981 100%)">
              <TrendingUp size={28} color="white" />
            </CardIcon>
            <div>
              <CardTitle>Optimize Swap</CardTitle>
              <CardSubtitle>1inch Fusion+</CardSubtitle>
            </div>
          </CardHeader>
          <CardDescription>
            Execute MEV-protected swaps with optimal routing through 1inch's Fusion+ infrastructure.
          </CardDescription>
          <ActionButton>
            Optimize Swap
            <ButtonIcon>
              <ArrowRight size={18} />
            </ButtonIcon>
          </ActionButton>
        </ActionCard>

        <ActionCard gradient="linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)">
              <Shield size={28} color="white" />
            </CardIcon>
            <div>
              <CardTitle>Security Check</CardTitle>
              <CardSubtitle>System Integrity</CardSubtitle>
            </div>
          </CardHeader>
          <CardDescription>
            Perform comprehensive security audit of all state channels and exchange connections.
          </CardDescription>
          <ActionButton>
            Security Check
            <ButtonIcon>
              <ArrowRight size={18} />
            </ButtonIcon>
          </ActionButton>
        </ActionCard>

        <ActionCard gradient="linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #ef4444 100%)">
          <CardHeader>
            <CardIcon color="linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #ef4444 100%)">
              <Zap size={28} color="white" />
            </CardIcon>
            <div>
              <CardTitle>Emergency Stop</CardTitle>
              <CardSubtitle>Critical Protocol</CardSubtitle>
            </div>
          </CardHeader>
          <CardDescription>
            Immediately halt all operations and freeze state channels for emergency situations.
          </CardDescription>
          <ActionButton>
            Emergency Stop
            <ButtonIcon>
              <ArrowRight size={18} />
            </ButtonIcon>
          </ActionButton>
        </ActionCard>
      </ActionsGrid>

      <StatsGrid>
        <StatCard gradient="linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)">
          <StatValue>1,247</StatValue>
          <StatLabel>Active Channels</StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)">
          <StatValue>$2.4M</StatValue>
          <StatLabel>Total Liquidity</StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #f59e0b 100%)">
          <StatValue>99.8%</StatValue>
          <StatLabel>Uptime</StatLabel>
        </StatCard>
        <StatCard gradient="linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #ef4444 100%)">
          <StatValue>0</StatValue>
          <StatLabel>Failed Transactions</StatLabel>
        </StatCard>
      </StatsGrid>
    </QuickActionsContainer>
  );
};

export default QuickActionsSection; 