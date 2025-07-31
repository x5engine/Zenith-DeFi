import React from 'react';
import styled from 'styled-components';
import StatusSection from './dashboard/StatusSection';
import TransactionsSection from './dashboard/TransactionsSection';
import QuickActionsSection from './dashboard/QuickActionsSection';
import TokenList from './dashboard/TokenList';
import SwapInterface from './SwapInterface';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #000000;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  background: #000000;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #000000;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #8b5cf6;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a855f7;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  height: 100%;
`;

const SwapSection = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 40px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-height: 0;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-height: 0;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <MainContent>
        <ContentArea>
          <ContentGrid>
            <SwapSection>
              <SwapInterface />
            </SwapSection>
            <LeftColumn>
              <StatusSection />
              <TransactionsSection />
              <QuickActionsSection />
            </LeftColumn>
            <RightColumn>
              <TokenList />
            </RightColumn>
          </ContentGrid>
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard; 